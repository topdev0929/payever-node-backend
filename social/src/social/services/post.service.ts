import { Injectable, Logger, HttpService, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import { CreatePostDto, MediaUploadResultDto, PostStateDto } from '../dtos';
import { PostModel } from '../models';
import { File, InitMediaPostInterface, MediaInterface, ThumbNailUrlInterface } from '../interfaces';
import { LeanDocument, Model } from 'mongoose';
import { PostSchemaName } from '../schemas';
import { BusinessLocalModel, BusinessLocalService } from '../../business';
import { InnerEventProducer } from '../producers';
import { 
  MediaTypeEnum,
  MediaUploadTypeEnum,
  MimeTypesEnum, 
  PostSentStatusEnum, 
  PostStateEventsEnum, 
  PostStatusEnum, 
  PoststatusEnum, 
  PostTypeEnum, 
  ThirdPartyActionEnum, 
  VideoPostEventsEnum,
} from '../enums';
import { EventDispatcher, IntercomService } from '@pe/nest-kit';
import { environment } from '../../environments';
import { VideoProcessingHelper } from '../helpers';
import { imageMimeTypes, videoMimeTypes } from '../settings';
import { ImageProcessor } from './media-uploader';
import { IntegrationSubscriptionModel } from '../../integration';
import { DuplicatePostDto } from '../dtos/duplicate-post.dto';
import { MultipartService } from './multipart.service';
import { MediaUploaderService } from './media-uploader.service';

const RETRY_COUNT_FOR_TPCM: number = 2;

@Injectable()
export class PostsService {
  public thirdpartyUrl: string;

  constructor(
    @InjectModel(PostSchemaName) private readonly postModel: Model<PostModel>,
    private readonly eventProducer: InnerEventProducer,
    private readonly eventDispatcher: EventDispatcher,
    private readonly intercomService: HttpService,
    private readonly imageProcessor: ImageProcessor,
    private readonly businessService: BusinessLocalService,
    private readonly logger: Logger,
    private readonly multipartService: MultipartService,
    private readonly mediaUploaderService: MediaUploaderService,
  ) {
    this.thirdpartyUrl = environment.thirdpartyUrl;
  }

  public async getByBusiness(business: BusinessLocalModel)
    : Promise<PostModel[]> {
    return this.postModel.find({ businessId: business._id });
  }

  public async getOneById(id: string)
    : Promise<PostModel> {
    return this.postModel.findOne({ _id: id });
  }

  public async getByBusinessAndId(businessId: string, postId: string)
    : Promise<PostModel> {
    return this.postModel.findOne({ businessId, _id: postId });
  }

  public async duplicate(
    business: BusinessLocalModel,
    duplicatePostDto: DuplicatePostDto,
  ): Promise<PostModel> {

    const target: PostModel = await this.postModel.findOne({
      businessId: business._id, _id: duplicatePostDto.id,
    }).exec();
    const targetObject: LeanDocument<PostModel> = target.toObject();

    delete targetObject.createdAt;
    delete targetObject.updatedAt;
    delete targetObject._id;

    const post = await this.postModel.create({
      ...targetObject,
    });

    await post.populate('channelSet').execPopulate();
    await this.eventProducer.triggerPostCreatedAction(business, post);

    return post;
  }

  public async create(
    business: BusinessLocalModel,
    createPostDto: CreatePostDto,
    postId?: string,
  ): Promise<PostModel> {
    if (createPostDto.status === PoststatusEnum.PostNow && !createPostDto.postedAt) {
      createPostDto.postedAt = new Date();
    }
    if (createPostDto.status === PoststatusEnum.Schedule && !createPostDto.toBePostedAt) {
      throw new BadRequestException(`toBePostedAt should not be empty for schedule post`);
    }

    await this.checkProductTypeOrRaiseAnError(createPostDto);

    let post: PostModel;

    if (postId) {
      post = await this.postModel.findOneAndUpdate(
        { _id: postId },
        { $set: {
          ...createPostDto,
          businessId: business._id,
          mediaType: '',
          sentStatus: PostSentStatusEnum.Sent,
        }},
        { new: true },
      );
    } else {
      post = await this.postModel.create({
        ...createPostDto,
        businessId: business._id,
        mediaType: '',
        sentStatus: PostSentStatusEnum.Sent,
      });
    }

    await post.populate('channelSet').execPopulate();
    await this.eventProducer.triggerPostCreatedAction(business, post);

    return post;
  }

  public createMediaPost():
  (
    files: File[],
    business: BusinessLocalModel,
    createPostDto: CreatePostDto,
    attachmentsUrl: string[],
  ) => Promise<PostModel> {
    return async (
      files: File[],
      business: BusinessLocalModel,
      createPostDto: CreatePostDto,
      attachmentsUrl: string[],
      postId?: string,
    ) => {
      if (createPostDto.status === PoststatusEnum.PostNow && !createPostDto.postedAt) {
        createPostDto.postedAt = new Date();
      }
      
      if (createPostDto.status === PoststatusEnum.Schedule && !createPostDto.toBePostedAt) {
        throw new BadRequestException(`toBePostedAt should not be empty for schedule post`);
      }

      if (files.length === 0) {
        if (
          createPostDto.type === PostTypeEnum.Product
          && createPostDto.media
          && createPostDto.media.length > 0
        ) {
          return this.createImagePost(createPostDto.media, business, createPostDto, postId);
        }

        return this.create(business, createPostDto, postId);
      }
      if (Object.values(videoMimeTypes).includes(files[0].mimetype as MimeTypesEnum)) {
        return this.createVideoPost(files[0], business, createPostDto, postId);
      } else if (Object.values(imageMimeTypes).includes(files[0].mimetype as MimeTypesEnum)) {
        return this.createImagePost(files, business, createPostDto, postId);
      }

      return this.create(business, createPostDto);
    };
  }

  public updateMediaPost():
  (
    files: File[],
    business: BusinessLocalModel,
    createPostDto: CreatePostDto,
    attachmentsUrl: string[],
  ) => Promise<PostModel> {
    return async (
      files: File[],
      business: BusinessLocalModel,
      createPostDto: CreatePostDto,
      attachmentsUrl: string[],
      postId?: string,
    ) => {
      if (createPostDto.status === PoststatusEnum.PostNow && !createPostDto.postedAt) {
        createPostDto.postedAt = new Date();
      }
      if (createPostDto.status === PoststatusEnum.Schedule && !createPostDto.toBePostedAt) {
        throw new BadRequestException(`toBePostedAt should not be empty for schedule post`);
      }
      if (files.length === 0) {
        if (
          createPostDto.type === PostTypeEnum.Product
          && createPostDto.media
          && createPostDto.media.length > 0
        ) {
          return this.updateImagePost(createPostDto.media, business, createPostDto, attachmentsUrl, postId);
        }

        return this.update(business, createPostDto, postId, attachmentsUrl);
      }
      if (Object.values(videoMimeTypes).includes(files[0].mimetype as MimeTypesEnum)) {
        return this.updateVideoPost(files[0], business, createPostDto, postId);
      } else if (Object.values(imageMimeTypes).includes(files[0].mimetype as MimeTypesEnum)) {
        return this.updateImagePost(files, business, createPostDto, attachmentsUrl, postId);
      }

      return this.update(business, createPostDto, postId, attachmentsUrl);
    };
  }

  public async createVideoPost(
    file: File,
    business: BusinessLocalModel,
    createPostDto: CreatePostDto,
    postId?: string,
  ): Promise<PostModel> {
    const processedVideo: {
      filePath: string;
      randomTempFolder: string;
      thumbnailSrc: File;
    } = await VideoProcessingHelper.uploadScreenShot(file);
    const mediaUploadResult: MediaUploadResultDto =
      await this.imageProcessor.upload(processedVideo.thumbnailSrc, business.id);

    let post: PostModel;

    if (postId) {
      post = await this.postModel.findOneAndUpdate(
        { _id: postId },
        { $set: {
          ...createPostDto,
          attachments: [{
            contentType: file.mimetype,
            previewUrl: mediaUploadResult.sourceUrl,
            thumbnailUrl: mediaUploadResult.thumbnail,
          }],
          businessId: business._id,
          mediaType: MediaTypeEnum.Video,
          sentStatus: PostSentStatusEnum.Pending,
        }},
      );
    } else {
      post = await this.postModel.create({
        ...createPostDto,
        attachments: [{
          contentType: file.mimetype,
          previewUrl: mediaUploadResult.sourceUrl,
          thumbnailUrl: mediaUploadResult.thumbnail,
        }],
        businessId: business._id,
        mediaType: MediaTypeEnum.Video,
        sentStatus: PostSentStatusEnum.Pending,
      });
    }

    await post.populate('channelSet').execPopulate();
    await this.eventDispatcher.dispatch(
      VideoPostEventsEnum.VideoPostCreated,
      {
        business,
        filePath: processedVideo.filePath,
        post,
        randomTempFolder: processedVideo.randomTempFolder,
      },
      { parentFolderId: createPostDto.parentFolderId },
    );

    return post;
  }

  public async updateVideoPost(
    file: File,
    business: BusinessLocalModel,
    createPostDto: CreatePostDto,
    postId?: string,
  ): Promise<PostModel> {
    const processedVideo: {
      filePath: string;
      randomTempFolder: string;
      thumbnailSrc: File;
    } = await VideoProcessingHelper.uploadScreenShot(file);
    const mediaUploadResult: MediaUploadResultDto =
      await this.imageProcessor.upload(processedVideo.thumbnailSrc, business.id);

    const data: PostModel = await this.postModel.findOne({_id: postId});
    const post: PostModel = await this.postModel.findOneAndUpdate(
        { _id: postId },
        { $set: {
          ...createPostDto,
          attachments: [{
            contentType: file.mimetype,
            previewUrl: mediaUploadResult.sourceUrl,
            thumbnailUrl: mediaUploadResult.thumbnail,
          }],
          businessId: business._id,
          mediaType: MediaTypeEnum.Video,
          sentStatus: PostSentStatusEnum.Pending,
        }},
        {new: true}
      );
    await post.populate('channelSet').execPopulate();
    const url = data.attachments.map ((content) => ({
      thumbnailUrl: content.thumbnailUrl,
    }));
    if (data.status === PoststatusEnum.Draft) {
     await this.eventDispatcher.dispatch(
        VideoPostEventsEnum.VideoPostCreated,
        {
          business,
          filePath: processedVideo.filePath,
          post,
          randomTempFolder: processedVideo.randomTempFolder,
          payload: url,
        },
        { parentFolderId: createPostDto.parentFolderId }
      );

      return post;
    } else {
      await this.eventDispatcher.dispatch(
        VideoPostEventsEnum.VideoPostUpdated,
        {
          business,
          filePath: processedVideo.filePath,
          post,
          randomTempFolder: processedVideo.randomTempFolder,
        },
        { parentFolderId: createPostDto.parentFolderId },
      );

      return post;
    }
  }

  public async updateImagePost(
    files: File[] | string[],
    business: BusinessLocalModel,
    createPostDto: CreatePostDto,
    attachmentsUrl: string[],
    postId?: string,
  ): Promise<PostModel> {
    const attachments: MediaInterface[] = [];
    const oldAttachments: MediaInterface[] = [];
    const post: PostModel = await this.postModel.findById(postId);
    post.attachments.forEach((attachment: MediaInterface) => {
      const attachmentExists: string = attachmentsUrl.find((url: string) => {
        return this.getPostId(attachment.url) === this.getPostId(url);
      });
      if (attachmentExists) {
        oldAttachments.push(attachment);
      }
    });

    for (const file of files) {
      if (createPostDto.type === PostTypeEnum.Product) {
        attachments.push({
          contentType: 'image/*',
          name: 'Product Image',
          previewUrl: file as string,
          thumbnailUrl: file as string,
          url: file as string,
        });
      } else {
        const mediaUploadResult: MediaUploadResultDto =
          await this.imageProcessor.upload(file as File, business.id);
        attachments.push({
          contentType: (file as File).mimetype,
          name: (file as File).originalname,
          previewUrl: mediaUploadResult.sourceUrl,
          thumbnailUrl: mediaUploadResult.thumbnail,
          url: mediaUploadResult.sourceUrl,
        });
      }
    }
    const data: PostModel = await this.postModel.findOne({_id: postId});

    if (data.status === PoststatusEnum.Draft) {
      const updatedPost: PostModel = await this.postModel.findOneAndUpdate(
        { _id: postId },
        { $set: {
          ...createPostDto,
          attachments: [...oldAttachments, ...attachments],
          businessId: business._id,
          mediaType: MediaTypeEnum.Image,
          sentStatus: PostSentStatusEnum.Sent,
        }},
        { new: true },
      );

      await updatedPost.populate('channelSet').execPopulate();
      await this.eventProducer.triggerPostCreatedAction(business, post);

      return updatedPost;
    } else {
       const updatedPost: PostModel = await this.postModel.findOneAndUpdate(
         { _id: postId },
         { $set: {
           ...createPostDto,
           attachments: [...oldAttachments, ...attachments],
           businessId: business._id,
           mediaType: MediaTypeEnum.Image,
           sentStatus: PostSentStatusEnum.Sent,
           }},
        { new: true },
       );

     await updatedPost.populate('channelSet').execPopulate();
     await this.eventProducer.triggerPostUpdatedAction(business, post);

     return updatedPost;
    }
  }

  public async createImagePost(
    files: File[] | string[],
    business: BusinessLocalModel,
    createPostDto: CreatePostDto,
    postId?: string,
  ): Promise<PostModel> {
    const attachments: MediaInterface[] = [];
    for (const file of files) {
      if (createPostDto.type === PostTypeEnum.Product) {
        attachments.push({
          contentType: 'image/*',
          name: 'Product Image',
          previewUrl: file as string,
          thumbnailUrl: file as string,
          url: file as string,
        });
      } else {
        const mediaUploadResult: MediaUploadResultDto =
          await this.imageProcessor.upload(file as File, business.id);
        attachments.push({
          contentType: (file as File).mimetype,
          name: (file as File).originalname,
          previewUrl: mediaUploadResult.sourceUrl,
          thumbnailUrl: mediaUploadResult.thumbnail,
          url: mediaUploadResult.sourceUrl,
        });
      }
    }
    let post: PostModel;
    if (postId) {
      post = await this.postModel.findOneAndUpdate(
        { _id: postId },
        { $set: {
          ...createPostDto,
          attachments,
          businessId: business._id,
          mediaType: MediaTypeEnum.Image,
          sentStatus: PostSentStatusEnum.Sent,
        }},
		{ new: true },
		);
    } else {
      post = await this.postModel.create({
        ...createPostDto,
        attachments,
        businessId: business._id,
        mediaType: MediaTypeEnum.Image,
        sentStatus: PostSentStatusEnum.Sent,
      });
    }
      await post.populate('channelSet').execPopulate();
      await this.eventProducer.triggerPostCreatedAction(business, post);

    return post;
  }

  public async update(
    business: BusinessLocalModel,
    createPostDto: CreatePostDto,
    postId: string,
    attachmentsUrl?: string[],
  ): Promise<PostModel> {
    const attachments: MediaInterface[] = [];
    if (attachmentsUrl) {
      const post: PostModel = await this.postModel.findById(postId);
      post.attachments.forEach((attachment: MediaInterface) => {
        const attachmentExists: string = attachmentsUrl.find((url: string) => {
          return this.getPostId(attachment.url) === this.getPostId(url);
        });
        if (attachmentExists) {
          attachments.push(attachment);
        }
      });
    }

    if (createPostDto.status === PoststatusEnum.PostNow && !createPostDto.postedAt) {
      createPostDto.postedAt = new Date();
    }
    if (createPostDto.status === PoststatusEnum.Schedule && !createPostDto.toBePostedAt) {
      throw new BadRequestException(`toBePostedAt should not be empty for schedule post`);
    }

    await this.checkProductTypeOrRaiseAnError(createPostDto);

    await this.postModel.findOneAndUpdate(
      { _id: postId},
      {
        $set: {
          ...createPostDto,
          businessId: business._id,
          mediaType: '',
          sentStatus: PostSentStatusEnum.Sent,
          ...( attachmentsUrl ? { attachments } : { } ),
        },
      },
    ).exec();
    const updatedPost: PostModel = await this.postModel.findOne(
      { _id: postId },
    ).exec();
    await updatedPost.populate('channelSet').execPopulate();

    if (!!updatedPost.postedAt || createPostDto.status !== PoststatusEnum.PostNow) {
      await this.eventProducer.triggerPostUpdatedAction(business, updatedPost);
    } else if (createPostDto.status === PoststatusEnum.PostNow) {
      await this.eventProducer.triggerPostCreatedAction(business, updatedPost);
    }

    return updatedPost;
  }

  public async updatePostState(
    post: PostModel,
    newPostState: PostStateDto,
  ): Promise<PostModel> {

    await this.postModel.updateOne(
      { _id: post._id },
      { $pull: { postState: { $elemMatch: { integrationName: newPostState.integrationName } } }},
    );

    let updatedPostModel: PostModel =  await this.postModel.findOneAndUpdate(
      { _id: post._id },
      { $push: { postState: newPostState } },
      { new: true },
    );

    if (newPostState.status === PostStatusEnum.Succeeded) {
      updatedPostModel = await this.postModel.findOneAndUpdate(
        { _id: post._id },
        { $set: { postedAt: newPostState.postedAt ? newPostState.postedAt : new Date() } },
        { new: true },
      );
    }

    await this.eventDispatcher.dispatch(
      PostStateEventsEnum.PostStateUpdated,
      updatedPostModel,
    );

    await this.businessService.populateIntegrations(post.business);

    return updatedPostModel;
  }

  public async delete(post: PostModel): Promise<void> {
    await post.populate('business').execPopulate();
    await post.populate('channelSet').execPopulate();
    await this.eventProducer.triggerPostDeletedAction(post.business, post);

    await post.remove();
  }

  public async uploadVideo(
    business: BusinessLocalModel,
    filePath: string,
    tempFolder: string,
    post: PostModel,
  ): Promise<void> {
    await this.postModel.updateOne(
      { _id: post._id },
      { $set: { sentStatus: PostSentStatusEnum.InProcess }},
    ).exec();

    await this.businessService.populateIntegrations(business);

    const integrations: Array<{ name: string }> = business.integrationSubscriptions.map(
      (subscription: IntegrationSubscriptionModel) => ({ name : subscription.integration.name }),
    );

    const payload: any = {
      action: 'init-media-post',
      business: {
        id: business.id,
      },
      data: {
        ...post.toObject(),
        thumbnail: post.attachments[0],
        mediaSize: fs.statSync(filePath).size,
      },
      integrations,
    };
    
    const result: any = await this.callThirdpartyApp(payload);
    const postDatas: InitMediaPostInterface[] = result.data.filter(Boolean);


    const splitFiles: File[] = await VideoProcessingHelper.splitVideo(filePath, tempFolder, this.logger);

    await Promise.all(postDatas.map((postData: InitMediaPostInterface) => {
      return this.mediaUploaderService.uploadAllMedia(
        postData.uploadMedia, 
        [filePath], 
        postData.type, 
        splitFiles,
      );
    }));

    await this.callThirdpartyApp({
      action: 'publish-post',
      business: {
        id: business.id,
      },
      data: {
        channelSet: post.channelSet,
        postId: post._id,
      },
      integrations,
    });
  }

  public async callThirdpartyAppForVideo(
    business: BusinessLocalModel,
    filePath: string,
    tempFolder: string,
    post: PostModel,
    action: ThirdPartyActionEnum,
    payload?: ThumbNailUrlInterface[],
  ): Promise<void> {
    await this.postModel.updateOne(
      { _id: post._id },
      { $set: { sentStatus: PostSentStatusEnum.InProcess }},
    ).exec();

    let isSuccess: boolean = true;
    let failedIntegrations: string[] = [];
    let counter: number = 0;
    const splitFiles: File[] = await VideoProcessingHelper.splitVideo(filePath, tempFolder, this.logger);
    business = await this.businessService.populateIntegrations(business);
    for (const splitFile of splitFiles) {
      counter++;
      const payloads: any = {
        action,
        business: {
          id: business.id,
        },
        payload,
        data: {
          ...post.toObject(),
          attachments: [
            {
              contentType: splitFile.mimetype,
              data: splitFile.buffer.toString('base64'),
              name: splitFile.originalname,
            },
          ],
          attachmentsCount: splitFiles.length,
          index: counter,
          thumbnail: post.attachments[0],
        },
        integrations: business.integrationSubscriptions.map(
          (subscription: IntegrationSubscriptionModel) => ({ name : subscription.integration.name }),
        ),
      };
      const result: any = await this.callThirdpartyApp(payloads);
      if (result?.failedIntegrations?.length > 0) {
        isSuccess = false;
        failedIntegrations = result.failedIntegrations;
        break;
      }
    }

    await this.postModel.updateOne(
      { _id: post._id },
      {
        $set: {
          failedIntegrations,
          sentStatus: isSuccess ? PostSentStatusEnum.Sent : PostSentStatusEnum.Failed,
        },
      },
    ).exec();
  }

  private async checkProductTypeOrRaiseAnError(dto: CreatePostDto): Promise<void> {
    if (dto.type !== PostTypeEnum.Product) {
      return;
    }

    const postHasNoMedia = !dto.media || dto.media.length === 0;
    const postHasNoProduct = !dto.productId || dto.productId.length === 0;

    if (postHasNoMedia) {
      throw new BadRequestException(`media should not be empty when posting a product`);
    }

    if (postHasNoProduct) {
      throw new BadRequestException(`productId should not be empty when posting a product`);
    }
  }

  private async callThirdpartyApp(payload: any, tried: number = RETRY_COUNT_FOR_TPCM)
  : Promise<{ failedIntegrations: string[]; data: any[] } | boolean> {
    return this.intercomService.post<any>(
      `${this.thirdpartyUrl}/api/social/action`,
      payload,
      {
        maxBodyLength: 52421800,
        maxContentLength: 52421800,
      },
    ).toPromise()
    .then((result: any) => result.data)
    .catch((err: any) => {
      return !!tried ? this.callThirdpartyApp(payload, tried - 1) : false;
    });
  }

  private getPostId(url: string): string {
    return url.split('/').pop().split('-media').shift();
  }
}

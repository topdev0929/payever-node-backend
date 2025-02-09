import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  CHANNEL_SET_SERVICE,
  ChannelEventMessagesProducer,
  ChannelModel,
  ChannelService,
  ChannelSetModel,
  ChannelSetServiceInterface,
} from '@pe/channels-sdk';
import { EventDispatcher, RedisClient } from '@pe/nest-kit';
import { FilterQuery, Model, QueryCursor } from 'mongoose';
import { fromEvent, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import slugify from 'slugify';

import { BusinessModel } from '../../business/models';
import {
  BlogAccessConfigSchemaName,
  BlogSchemaName,
  BusinessSchemaName,
} from '../../mongoose-schema/mongoose-schema.names';
import { BlogWithAccessConfigResponseDto, CreateBlogDto, LinksMaskingIngressDto, UpdateBlogDto } from '../dto';
import { environment } from '../../environments';
import { BlogRabbitEventsProducer } from '../producers';
import { BaseBlogInterface, ValidateBlogNameResponseInterface } from '../interfaces';
import { BlogAccessConfigModel, BlogModel } from '../models';
import { BlogAccessConfigService } from './blog-access-config.service';
import { KubernetesEventEnum } from '@pe/kubernetes-kit/module/kubernetes/enums';
import { BlogEventsEnum } from '../enums';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(BlogSchemaName) private readonly blogModel: Model<BlogModel>,
    @InjectModel(BlogAccessConfigSchemaName) private readonly blogAccessConfigsModel: Model<BlogAccessConfigModel>,
    @InjectModel(BusinessSchemaName) private readonly businessModel: Model<BusinessModel>,
    private readonly channelService: ChannelService,
    @Inject(CHANNEL_SET_SERVICE) private readonly channelSetService: ChannelSetServiceInterface,
    private readonly channelEventMessagesProducer: ChannelEventMessagesProducer,
    private readonly blogEventsProducer: BlogRabbitEventsProducer,
    private readonly dispatcher: EventDispatcher,
    private readonly blogAccessConfigService: BlogAccessConfigService,
    private readonly redisClient: RedisClient,
  ) { }

  public async create(
    business: BusinessModel,
    createBlogDto: CreateBlogDto,
    isDefault: boolean = false,
  ): Promise<BlogModel> {

    const validateBlogName: ValidateBlogNameResponseInterface
    = await this.validateBlogName(createBlogDto.name, business, null);

    if (!validateBlogName.result) {
      const suffix: string = ('0000' + ((new Date()).getTime() % Math.pow(36, 4)).toString(36)).substr(-4);
      createBlogDto.name = createBlogDto.name + '-' + suffix;
    }

    const channel: ChannelModel = await this.channelService.findOneByType('blog');
    const channelSets: ChannelSetModel[] = await this.channelSetService.create(channel, business);
    const channelSet: ChannelSetModel = channelSets[0];

    await this.channelEventMessagesProducer.sendChannelSetNamedByApplication(
      channelSet,
      createBlogDto.name,
    );

    let blog: BlogModel = null;
    const createDto: BaseBlogInterface = {
      ...createBlogDto,
      business,
      channelSet: channelSet,
    };
    blog = await this.blogModel.create({ ...createDto, isDefault: isDefault });

    await this.businessModel.findOneAndUpdate(
      { _id: business.id },
      { $push: { blogs: blog } },
    );

    await this.blogAccessConfigService.createOrUpdate(blog, {
      isLive: false,
    });

    await this.dispatcher.dispatch(BlogEventsEnum.BlogCreated, blog);
    await this.blogEventsProducer.blogCreated(business, blog);

    return blog;
  }

  public async getByDomain(domain: string): Promise<BlogAccessConfigModel> {
    const blogsDomain: string = environment.blogsDomain;

    const condition: FilterQuery<BlogAccessConfigModel> = blogsDomain && domain.endsWith(blogsDomain)
      ? { internalDomain: domain.replace('.' + blogsDomain, '') }
      : { ownDomain: domain };

    return this.blogAccessConfigService.findOneByCondition(condition);
  }

  public async removeInBusinessId(
    businessId: string,
    blog: BlogModel,
    deleteTestData: boolean = false,
  ): Promise<void> {
    const query: any = {
      $or: [
        { business: businessId },
      ],
    };
    const currentBlogsCount: number = await this.blogModel.count(query);
    if (currentBlogsCount <= 1) {
      await this.blogModel.findOneAndUpdate(
        { _id: blog.id },
        {
          $set: {
            isDefault: true,
          },
        },
      );

      return ;
    }
    await blog.populate('channelSet').populate('business').execPopulate();
    await this.blogModel.remove({ _id: blog.id });
    await this.businessModel.update(
      { _id: businessId },
      { $pull: { blogs: blog.id } },
    );
    await this.dispatcher.dispatch(BlogEventsEnum.BlogRemoved, blog, deleteTestData);
    await this.blogEventsProducer.blogRemoved(businessId, blog);
  }

  public async removeInBusiness(
    business: BusinessModel,
    blog: BlogModel,
  ): Promise<void> {
    const currentBlogsCount: number = await this.blogModel.count({ business });
    if (currentBlogsCount <= 1) {
      throw new BadRequestException(`Can not delete the last blog`);
    }
    await blog.populate('channelSet').populate('business').execPopulate();
    await this.blogModel.remove({ _id: blog.id });
    await this.businessModel.update(
      { _id: business.id },
      { $pull: { blogs: blog.id } },
    );
    await this.dispatcher.dispatch(BlogEventsEnum.BlogRemoved, blog);
    await this.blogEventsProducer.blogRemoved(business._id, blog);
  }

  public async removeById(id: string): Promise<void> {
    const blog: BlogModel = await this.blogModel.findOneAndDelete({ _id: id });
    await blog
      .populate('channelSet')
      .populate('business')
      .execPopulate()
    ;

    await this.dispatcher.dispatch(BlogEventsEnum.BlogRemoved, blog);
  }

  public async findAllByBusiness(business: BusinessModel): Promise<BlogModel[]> {
    return this.blogModel.find({
      business: business._id,
    });
  }

  public findAll(batchSize: number): Observable<any> {
    const cursor: QueryCursor<BlogModel> = this.blogModel
      .find({ })
      .cursor({ batchSize});

    return fromEvent(cursor, 'data')
    .pipe(
      takeUntil(
        fromEvent(cursor, 'end'),
      ),
    );
  }

  public async findOneById(blogId: string): Promise<BlogModel> {
    return this.blogModel.findOne({ _id: blogId });
  }

  public async update(
    business: BusinessModel,
    blog: BlogModel,
    updateBlogDto: UpdateBlogDto,
  ): Promise<BlogModel> {

    if (updateBlogDto.name) {
      const validateBlogName: ValidateBlogNameResponseInterface
      = await this.validateBlogName(updateBlogDto.name, business, null);

      if (!validateBlogName.result) {
        throw new BadRequestException(validateBlogName.message);
      }
    }

    const originalBlog: BlogModel = await this.blogModel.findOne({ _id: blog.id });
    const updatedBlog: BlogModel = await this.blogModel.findOneAndUpdate(
      { _id: blog.id },
      { $set: updateBlogDto },
      { new: true },
    );

    if (updateBlogDto.name && blog.name !== updateBlogDto.name) {
      await blog.populate('channelSet').execPopulate();
      await this.channelEventMessagesProducer.sendChannelSetNamedByApplication(
        blog.channelSet,
        updateBlogDto.name,
      );
    }

    await this.dispatcher.dispatch(BlogEventsEnum.BlogUpdated, originalBlog, updatedBlog);

    await this.blogEventsProducer.blogUpdated(business, updatedBlog);

    return updatedBlog;
  }

  public async updateCommentsCount(
    business: BusinessModel,
    blog: BlogModel,
    commentsCount: number,
  ): Promise<BlogModel> {
    const originalBlog: BlogModel = await this.blogModel.findOne({ _id: blog.id });
    const updatedBlog: BlogModel = await this.blogModel.findOneAndUpdate(
      { _id: blog.id },
      { $set: { commentsCount } },
      { new: true },
    );

    await blog.populate('channelSet').execPopulate();

    await this.dispatcher.dispatch(BlogEventsEnum.BlogUpdated, originalBlog, updatedBlog);

    await this.blogEventsProducer.blogUpdated(business, updatedBlog);

    return updatedBlog;
  }

  public async getList(query: { }, limit: number, skip: number): Promise<BlogModel[]> {
    return this.blogModel.find(query)
      .limit(limit)
      .skip(skip)
      .populate('business')
    ;
  }

  public async validateBlogName(
    name: string,
    business: BusinessModel,
    blogId: string,
  ): Promise<ValidateBlogNameResponseInterface> {
    if (!name) {
      return {
        message: 'Name must be not empty',
        result: false,
      };
    }

    const blogByName: BlogModel = await this.blogModel.findOne({
      business: business._id,
      name: name,
    });

    if (blogByName && blogByName.id !== blogId) {
      return {
        message: `Blog with name "${name}" already exists for business: "${business.id}"`,
        result: false,
      };
    }
    const domain: string = slugify(name).toLowerCase();

    const config: BlogAccessConfigModel = await this.blogAccessConfigsModel.findOne({
      internalDomainPattern: domain,
    });


    if (!!config && config.blog) {
      return {
        message: `Blog with domain "${domain}" already exists"`,
        result: false,
      };
    }

    return {
      result: true,
    };
  }

  public async getDefault(
    business: BusinessModel,
  ): Promise<BlogModel> {
    return this.blogModel.findOne(
      {
        business: business._id,
        isDefault: true,
      },
    );
  }

  public async makeDefault(
    blog: BlogModel,
    business: BusinessModel,
  ): Promise<BlogModel> {
    await this.blogModel.updateMany( { business: business._id }, { isDefault: false } );

    return this.blogModel.findOneAndUpdate( { _id: blog._id }, { $set: { isDefault: true } }, { new: true } );
  }

  public async blogToBlogWithAccessConfigResponseDto(blog: BlogModel): Promise<BlogWithAccessConfigResponseDto> {
    const accessConfig: BlogAccessConfigModel = await this.blogAccessConfigService.findByBlog(blog);

    return { ...blog.toObject(), accessConfig: accessConfig } as any;
  }

  public async linksMaskingIngress(dto: LinksMaskingIngressDto): Promise<void> {
    const payload: any[] = [];
    const accessConfig: BlogAccessConfigModel = await this.blogAccessConfigService.findOneByCondition(
      { blog: dto.pageLinks[0].applicationId as any },
    );

    const domainName: string = process.env.BUILDER_BLOG_DOMAINS
      .replace('DOMAIN', accessConfig?.internalDomain);

    for (const pageLink of dto.pageLinks) {
      payload.push(
        {
          accessConfigId: accessConfig._id,
          domainName: domainName,
          maskingPath: pageLink.maskingPath,
          targetApp: pageLink.targetApp,
          targetDomain: pageLink.targetDomain,
        },
      );
    }

    await this.dispatcher.dispatch(
      KubernetesEventEnum.LinkMask,
      payload,
    );
  }

  public async findByBusinessIds(businessIds: string[]): Promise<BlogModel[]> {
    return this.blogModel.find({ business: { $in : businessIds as any } });
  }

  public async findInactiveByBusinessId(businessId: string): Promise<BlogModel[]> {
    return this.blogModel.find({
      business: businessId as any,
      isDefault: { $ne: true },
    });
  }

  public async findInactive(): Promise<BlogModel[]> {
    return this.blogModel.find({
      isDefault: { $ne: true },
    });
  }
}

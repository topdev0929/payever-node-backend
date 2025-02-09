import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StudioImagesUploadedDto, StudioImagesUploadedErrorDto } from '../dto';
import { UserMediaModel } from '../models';
import { UserMediaSchemaName } from '../schemas';
import { SubscriptionMediaUploadedInterface, UserMediaUploadedInterface } from '../interfaces';
import { SubscriptionMediaService } from './subscription-media.service';
import { UserMediaService } from './user-media.service';
import { StudioMediasUploadedMessagesProducer } from '../producers';
import { BlobInterface } from '../interfaces/blob.interface';

@Injectable()
export class StudioMediasUploadedService {

  constructor(
    @InjectModel(UserMediaSchemaName) private readonly userMediaModel: Model<UserMediaModel>,
    private readonly subscriptionMediaService: SubscriptionMediaService,
    private readonly userMediaService: UserMediaService,
    private readonly studioMediasUploadedMessagesProducer: StudioMediasUploadedMessagesProducer,
  ) { }

  public async saveUploadMedia(
    studioImagesUploadedDto: StudioImagesUploadedDto,
  ): Promise<void> {
    if (studioImagesUploadedDto.businessId) {
      await this.saveUploadedUserMedia(studioImagesUploadedDto);
    } else {
      await this.saveUploadedSubscriptionMedia(studioImagesUploadedDto);
    }
  }

  public async saveMediaUploadError(
    studioImagesUploadedErrorDto: StudioImagesUploadedErrorDto,
  ): Promise<void> {
    if (studioImagesUploadedErrorDto.businessId) {
      await this.studioMediasUploadedMessagesProducer.userMediasUploadedError(
        studioImagesUploadedErrorDto.medias,
        studioImagesUploadedErrorDto.businessId,
      );
    } else {
      await this.studioMediasUploadedMessagesProducer.subscriptionMediasUploadedError(
        studioImagesUploadedErrorDto.medias,
      );
    }
  }

  private async saveUploadedUserMedia(studioImagesUploadedDto: StudioImagesUploadedDto): Promise<void> {
    const userImages: UserMediaUploadedInterface[] = studioImagesUploadedDto.medias as UserMediaUploadedInterface[];
    const mediaBlob: BlobInterface[] = await this.userMediaService.saveMediasUploaded(
      userImages,
      studioImagesUploadedDto.businessId,
      studioImagesUploadedDto.baseUrl,
    );
    await this.studioMediasUploadedMessagesProducer.userMediasUploaded(mediaBlob, studioImagesUploadedDto.businessId);
  }

  private async saveUploadedSubscriptionMedia(studioImagesUploadedDto: StudioImagesUploadedDto): Promise<void> {
    const subscriptionMedias: SubscriptionMediaUploadedInterface[] =
      studioImagesUploadedDto.medias as SubscriptionMediaUploadedInterface[];
    const mediaBlob: BlobInterface[] = await this.subscriptionMediaService.saveMediasUploaded(subscriptionMedias);
    await this.studioMediasUploadedMessagesProducer.subscriptionMediasUploaded(mediaBlob);
  }
}

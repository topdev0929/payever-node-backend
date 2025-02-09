import { BaseFixture } from '@pe/cucumber-sdk/module';
import { MediaContainersEnum } from '@pe/media-sdk';
import { Model } from 'mongoose';
import { MediaItemModel } from '../../src/media/models/media-item.model';
import { BusinessFactory } from '../factories';
import { BusinessModel, MediaItemRelationModel } from '../../src/media/models';
import { getModelToken } from '@nestjs/mongoose';
import { EntityTypeEnum } from '../../src/media/enums';


const BUSINESS_ID_1: string = 'business-1';
const BUSINESS_ID_2: string = 'business-2';
const APPLICATION_ID_1: string = 'application-1';

class AdminFilesDeleteMultiFixture extends BaseFixture {
  private readonly mediaItemModel: Model<MediaItemModel> = this.application.get('MediaItemModel');
  private readonly mediItemRelation: Model<MediaItemRelationModel> = this.application.get('MediaItemRelationModel');
  private readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken('Business'));

  public async apply(): Promise<void> {

    // Add business
    await this.businessModel.create(BusinessFactory.create({
      _id: BUSINESS_ID_1,
    }));

    await this.businessModel.create(BusinessFactory.create({
      _id: BUSINESS_ID_2,
    }));


    // Media Items
    await this.mediaItemModel.create({
      _id: 'media-item-1',
      applicationId: APPLICATION_ID_1,
      container: MediaContainersEnum.Message,
      name: 'media-1',
    });

    await this.mediaItemModel.create({
      _id: 'media-item-2',
      applicationId: APPLICATION_ID_1,
      container: MediaContainersEnum.Message,
      name: 'media-2',
    });

    await this.mediaItemModel.create({
      _id: 'media-item-3',
      applicationId: APPLICATION_ID_1,
      container: MediaContainersEnum.Products,
      name: 'media-3',
    });

    await this.mediaItemModel.create({
      _id: 'media-item-4',
      applicationId: APPLICATION_ID_1,
      container: MediaContainersEnum.Products,
      name: 'media-4',
    });

    await this.mediaItemModel.create({
      _id: 'media-item-5',
      applicationId: APPLICATION_ID_1,
      container: MediaContainersEnum.Products,
      name: 'media-5',
    });

    await this.mediaItemModel.create({
      _id: 'media-item-6',
      applicationId: APPLICATION_ID_1,
      container: MediaContainersEnum.Products,
      name: 'media-6',
    });


    // Media Item Relation: for business 1
    await this.mediItemRelation.create([
      {
        entityId: BUSINESS_ID_1,
        entityType: EntityTypeEnum.business,
        mediaItem: 'media-item-1',
      },
      {
        entityId: BUSINESS_ID_1,
        entityType: EntityTypeEnum.business,
        mediaItem: 'media-item-2',
      },
      {
        entityId: BUSINESS_ID_1,
        entityType: EntityTypeEnum.business,
        mediaItem: 'media-item-3',
      },
      {
        entityId: BUSINESS_ID_1,
        entityType: EntityTypeEnum.business,
        mediaItem: 'media-item-4',
      },
      {
        entityId: BUSINESS_ID_1,
        entityType: EntityTypeEnum.business,
        mediaItem: 'media-item-5',
      },
      {
        entityId: BUSINESS_ID_1,
        entityType: EntityTypeEnum.business,
        mediaItem: 'media-item-6',
      },
    ]);


    // Media Item Relation: for business 2
    await this.mediItemRelation.create([
      {
        entityId: BUSINESS_ID_2,
        entityType: EntityTypeEnum.business,
        mediaItem: 'media-item-1',
      },
      {
        entityId: BUSINESS_ID_2,
        entityType: EntityTypeEnum.business,
        mediaItem: 'media-item-2',
      },
      {
        entityId: BUSINESS_ID_2,
        entityType: EntityTypeEnum.business,
        mediaItem: 'media-item-3',
      },
    ]);

  }
}

export = AdminFilesDeleteMultiFixture;

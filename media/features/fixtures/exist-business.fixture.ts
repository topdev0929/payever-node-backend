import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessFactory } from '../factories';
import { BusinessModel, MediaItemModel } from '../../src/media/models';
import { MediaItemRelationModel } from '../../src/media/models/media-item-relation.model';
import { EntityTypeEnum } from '../../src/media/enums/entity-type.enum';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

class ExistBusinessFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken('Business'));
  private readonly mediaItemModel: Model<MediaItemModel> = this.application.get('MediaItemModel');
  private readonly mediItemRelation: Model<MediaItemRelationModel> = this.application.get('MediaItemRelationModel');

  public async apply(): Promise<void> {
    await this.businessModel.create(BusinessFactory.create({
      _id: BUSINESS_ID,
      name: 'test',
    }));

    await this.mediaItemModel.create({
      _id: 'media-item-1',
      container: 'cdn/social',
      name: 'test',
    });

    await this.mediItemRelation.create({
      entityId: BUSINESS_ID,
      entityType: EntityTypeEnum.business,
      mediaItem: 'media-item-1',
    });
  }
}

export = ExistBusinessFixture;

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LegalDocumentTypesEnum } from '@pe/common-sdk';
import { EventDispatcher } from '@pe/nest-kit';
import { Model } from 'mongoose';
import { BusinessModel } from '../../user/models';
import { BusinessLegalDocumentEventsEnum } from '../enums';
import { BusinessLegalDocumentModel } from '../models';
import { BusinessLegalDocumentSchemaName } from '../schema';

@Injectable()
export class BusinessLegalDocumentService {
  constructor(
    @InjectModel(BusinessLegalDocumentSchemaName) private readonly dataModel: Model<BusinessLegalDocumentModel>,
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  public async updateDocument(
    business: BusinessModel,
    type: LegalDocumentTypesEnum,
    content: string,
  ): Promise<BusinessLegalDocumentModel> {
    const document: BusinessLegalDocumentModel = await this.dataModel.findOneAndUpdate(
      {
        business: business.id,
        type: type,
      },
      {
        $set: {
          content: content,
        },
      },
      {
        new: true,
        setDefaultsOnInsert: true,
        upsert: true,
      },
    ).exec();

    await this.eventDispatcher.dispatch(BusinessLegalDocumentEventsEnum.Updated, document);

    return document;
  }

  public async hasAnyDocument(business: BusinessModel): Promise<boolean> {
    return await this.dataModel.findOne({
      business: business.id,
    }) !== null;
  }
}

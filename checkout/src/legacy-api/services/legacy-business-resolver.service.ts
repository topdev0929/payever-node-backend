import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessModel } from '../../business/models';
import { BusinessSchemaName } from '../../mongoose-schema';

@Injectable()
export class LegacyBusinessResolverService {
  constructor(
    @InjectModel(BusinessSchemaName) private readonly businessModel: Model<BusinessModel>,
  ) { }

  public async resolve(slugOrUuid: string): Promise<BusinessModel> {
    return this.businessModel.findOne({
      $or: [
        { _id: slugOrUuid },
        { slug: slugOrUuid },
      ],
    });
  }
}

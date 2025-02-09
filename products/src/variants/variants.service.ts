import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { VariantDocument } from './variant.document';
import { Model } from 'mongoose';
import { VariantInterface } from './interfaces/variant.interface';
import { SaleHelper } from '../common/helpers';

@Injectable()
export class VariantsService {
  constructor(@InjectModel('Variant') private readonly variants: Model<VariantDocument>) { }

  public async get(id: string): Promise<VariantInterface> {
    const doc: VariantDocument = await this.variants.findById(id);
    if (!doc) {
      throw Error(`Variant "${id}" is not found.`);
    }

    return doc.toObject();
  }

  public async getMany(ids: string[]): Promise<VariantInterface[]> {
    const docs: VariantDocument[] = await this.variants.find({ _id: { $in: ids } });

    return docs.map((x: VariantDocument) => {
      let data: any = x.toObject();
      data = SaleHelper.saleDateFormat(data);

      return data;
    });
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { TaxDto, TaxModel, TaxService } from '@pe/common-sdk';
import { ListDto } from '../dto';

@Injectable()
export class AdminTaxService extends TaxService {

  public async retrieveListForAdmin(
    query: ListDto,
  ): Promise<{ page: number; total: number; taxes: TaxModel[] }> {

    const limit: number = query.limit * 1 || 100;
    const page: number = query.page * 1 || 1;
    const offset: number = (page - 1) * limit;

    const conditions: any = { };

    if (query.searchString) {
      conditions.$text = { $search: query.searchString };
    }

    const taxes: TaxModel[] = await this.dataModel.find()
      .find(conditions)
      .select(query.projection)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    const total: number = await this.dataModel.count();

    return {
      page,
      taxes,
      total,
    };
  }

  public async create(
    dto: TaxDto,
  ): Promise<TaxModel> {
    const tax: TaxModel = await this.dataModel.findOne({
      _id: dto.id,
    });

    if (tax) {
      throw new BadRequestException(
        `Tax with id "${dto.id}" already exists`,
      );
    }

    return this.dataModel.create({
      _id: dto.id,
      ...dto,
    });
  }

  public async update(
    id: string,
    dto: Partial<TaxDto>,
  ): Promise<TaxModel> {
    return this.dataModel.findOneAndUpdate(
      { _id: id },
      { $set: { ...dto } },
      { new: true },
    );
  }

  public async delete(
    tax: TaxModel,
  ): Promise<TaxModel> {
    tax.delete();

    return tax;
  }

}

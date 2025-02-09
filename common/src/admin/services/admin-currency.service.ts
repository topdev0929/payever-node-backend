import { BadRequestException, Injectable } from '@nestjs/common';
import { CurrencyModel, CurrencyService } from '@pe/common-sdk';
import { ListDto } from '../dto';
import { CurrencyDto } from '../dto/currency.dto';

@Injectable()
export class AdminCurrencyService extends CurrencyService {

  public async retrieveListForAdmin(
    query: ListDto,
  ): Promise<{ page: number; total: number; currencies: CurrencyModel[] }> {

    const limit: number = query.limit * 1 || 100;
    const page: number = query.page * 1 || 1;
    const offset: number = (page - 1) * limit;

    const conditions: any = { };

    if (query.searchString) {
      conditions.$text = { $search: query.searchString };
    }

    const currencies: CurrencyModel[] = await this.dataModel.find()
      .find(conditions)
      .select(query.projection)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    const total: number = await this.dataModel.count();

    return {
      currencies,
      page,
      total,
    };
  }

  public async create(
    dto: CurrencyDto,
  ): Promise<CurrencyModel> {
    const currency: CurrencyModel = await this.dataModel.findOne({
      _id: dto.id,
    });

    if (currency) {
      throw new BadRequestException(
        `Currency with id "${dto.id}" already exists`,
      );
    }

    return this.dataModel.create({
      _id: dto.id,
      ...dto,
    });
  }

  public async update(
    id: string,
    dto: Partial<CurrencyDto>,
  ): Promise<CurrencyModel> {
    return this.dataModel.findOneAndUpdate(
      { _id: id },
      { $set: { ...dto } },
      { new: true },
    );
  }

  public async delete(
    currency: CurrencyModel,
  ): Promise<CurrencyModel> {
    currency.delete();

    return currency;
  }

}

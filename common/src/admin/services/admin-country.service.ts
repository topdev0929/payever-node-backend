import { BadRequestException, Injectable } from '@nestjs/common';
import { CountryModel, CountryService } from '@pe/common-sdk';
import { CountryDto, ListDto } from '../dto';

@Injectable()
export class AdminCountryService extends CountryService {

  public async retrieveListForAdmin(
    query: ListDto,
  ): Promise<{ page: number; total: number; countries: CountryModel[] }> {

    const limit: number = query.limit * 1 || 100;
    const page: number = query.page * 1 || 1;
    const offset: number = (page - 1) * limit;

    const conditions: any = { };

    if (query.searchString) {
      conditions.$text = { $search: query.searchString };
    }

    const countries: CountryModel[] = await this.dataModel.find()
      .find(conditions)
      .select(query.projection)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    const total: number = await this.dataModel.count();

    return {
      countries,
      page,
      total,
    };
  }

  public async create(
    dto: CountryDto,
  ): Promise<CountryModel> {
    const country: CountryModel = await this.dataModel.findOne({
      _id: dto.id,
    });

    if (country) {
      throw new BadRequestException(
        `Country with id "${dto.id}" already exists`,
      );
    }

    return this.dataModel.create({
      _id: dto.id,
      ...dto,
    });
  }

  public async update(
    id: string,
    dto: Partial<CountryDto>,
  ): Promise<CountryModel> {
    return this.dataModel.findOneAndUpdate(
      { _id: id },
      { $set: { ...dto } },
      { new: true },
    );
  }

  public async delete(
    country: CountryModel,
  ): Promise<CountryModel> {
    country.delete();

    return country;
  }

}

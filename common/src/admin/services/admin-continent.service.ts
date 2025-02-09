import { BadRequestException, Injectable } from '@nestjs/common';
import { ContinentDto, ContinentModel, ContinentService } from '@pe/common-sdk';
import { ListDto } from '../dto';

@Injectable()
export class AdminContinentService extends ContinentService {

  public async retrieveListForAdmin(
    query: ListDto,
  ): Promise<{ page: number; total: number; continents: ContinentModel[] }> {

    const limit: number = query.limit * 1 || 100;
    const page: number = query.page * 1 || 1;
    const offset: number = (page - 1) * limit;

    const conditions: any = { };

    if (query.searchString) {
      conditions.$text = { $search: query.searchString };
    }

    const continents: ContinentModel[] = await this.dataModel.find()
      .find(conditions)
      .select(query.projection)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    const total: number = await this.dataModel.count();

    return {
      continents,
      page,
      total,
    };
  }

  public async create(
    dto: ContinentDto,
  ): Promise<ContinentModel> {
    const continent: ContinentModel = await this.dataModel.findOne({
      _id: dto.id,
    });

    if (continent) {
      throw new BadRequestException(
        `Continent with id "${dto.id}" already exists`,
      );
    }

    return this.dataModel.create({
      _id: dto.id,
      ...dto,
    });
  }

  public async update(
    id: string,
    dto: Partial<ContinentDto>,
  ): Promise<ContinentModel> {
    return this.dataModel.findOneAndUpdate(
      { _id: id },
      { $set: { ...dto } },
      { new: true },
    );
  }

  public async delete(
    continent: ContinentModel,
  ): Promise<ContinentModel> {
    continent.delete();

    return continent;
  }

}

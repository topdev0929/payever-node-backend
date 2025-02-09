import { BadRequestException, Injectable } from '@nestjs/common';
import { CommonStorageDto, CommonStorageModel, CommonStorageService } from '@pe/common-sdk';
import { ListDto } from '../dto';

@Injectable()
export class AdminCommonStorageService extends CommonStorageService {

  public async retrieveListForAdmin(
    query: ListDto,
  ): Promise<{ page: number; total: number; commonStorage: CommonStorageModel[] }> {

    const limit: number = query.limit * 1 || 100;
    const page: number = query.page * 1 || 1;
    const offset: number = (page - 1) * limit;

    const conditions: any = { };

    if (query.searchString) {
      conditions.$text = { $search: query.searchString };
    }

    const commonStorage: CommonStorageModel[] = await this.dataModel.find()
      .find(conditions)
      .select(query.projection)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    const total: number = await this.dataModel.count();

    return {
      commonStorage,
      page,
      total,
    };
  }

  public async create(
    dto: CommonStorageDto,
  ): Promise<CommonStorageModel> {
    const commonStorage: CommonStorageModel = await this.dataModel.findOne({
      _id: dto.id,
    });

    if (commonStorage) {
      throw new BadRequestException(
        `CommonStorage with id "${dto.id}" already exists`,
      );
    }

    return this.dataModel.create({
      _id: dto.id,
      ...dto,
    });
  }

  public async update(
    id: string,
    dto: Partial<CommonStorageDto>,
  ): Promise<CommonStorageModel> {
    return this.dataModel.findOneAndUpdate(
      { _id: id },
      { $set: { ...dto } },
      { new: true },
    );
  }

  public async delete(
    commonStorage: CommonStorageModel,
  ): Promise<CommonStorageModel> {
    commonStorage.delete();

    return commonStorage;
  }

}

import { BadRequestException, Injectable } from '@nestjs/common';
import { LanguageDto, LanguageModel, LanguageService } from '@pe/common-sdk';
import { ListDto } from '../dto';

@Injectable()
export class AdminLanguageService extends LanguageService {

  public async retrieveListForAdmin(
    query: ListDto,
  ): Promise<{ page: number; total: number; languages: LanguageModel[] }> {

    const limit: number = query.limit * 1 || 100;
    const page: number = query.page * 1 || 1;
    const offset: number = (page - 1) * limit;

    const conditions: any = { };

    if (query.searchString) {
      conditions.$text = { $search: query.searchString };
    }

    const languages: LanguageModel[] = await this.dataModel.find()
      .find(conditions)
      .select(query.projection)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    const total: number = await this.dataModel.count();

    return {
      languages,
      page,
      total,
    };
  }

  public async create(
    dto: LanguageDto,
  ): Promise<LanguageModel> {
    const language: LanguageModel = await this.dataModel.findOne({
      _id: dto.id,
    });

    if (language) {
      throw new BadRequestException(
        `Language with id "${dto.id}" already exists`,
      );
    }

    return this.dataModel.create({
      _id: dto.id,
      ...dto,
    });
  }

  public async update(
    id: string,
    dto: Partial<LanguageDto>,
  ): Promise<LanguageModel> {
    return this.dataModel.findOneAndUpdate(
      { _id: id },
      { $set: { ...dto } },
      { new: true },
    );
  }

  public async delete(
    language: LanguageModel,
  ): Promise<LanguageModel> {
    language.delete();

    return language;
  }

}

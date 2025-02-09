import { BadRequestException, Injectable } from '@nestjs/common';
import { LegalFormDto, LegalFormModel, LegalFormService } from '@pe/common-sdk';
import { ListDto } from '../dto';

@Injectable()
export class AdminLegalFormService extends LegalFormService {

  public async retrieveListForAdmin(
    query: ListDto,
  ): Promise<{ page: number; total: number; legalForms: LegalFormModel[] }> {

    const limit: number = query.limit * 1 || 100;
    const page: number = query.page * 1 || 1;
    const offset: number = (page - 1) * limit;

    const conditions: any = { };

    if (query.searchString) {
      conditions.$text = { $search: query.searchString };
    }

    const legalForms: LegalFormModel[] = await this.dataModel.find()
      .find(conditions)
      .select(query.projection)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    const total: number = await this.dataModel.count();

    return {
      legalForms,
      page,
      total,
    };
  }

  public async create(
    dto: LegalFormDto,
  ): Promise<LegalFormModel> {
    const legalForm: LegalFormModel = await this.dataModel.findOne({
      _id: dto.id,
    });

    if (legalForm) {
      throw new BadRequestException(
        `LegalForm with id "${dto.id}" already exists`,
      );
    }

    return this.dataModel.create({
      _id: dto.id,
      ...dto,
    });
  }

  public async update(
    id: string,
    dto: Partial<LegalFormDto>,
  ): Promise<LegalFormModel> {
    return this.dataModel.findOneAndUpdate(
      { _id: id },
      { $set: { ...dto } },
      { new: true },
    );
  }

  public async delete(
    legalForm: LegalFormModel,
  ): Promise<LegalFormModel> {
    legalForm.delete();

    return legalForm;
  }

}

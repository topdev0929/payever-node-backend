import { BadRequestException, Injectable } from '@nestjs/common';
import { LegalDocumentDto, LegalDocumentModel, LegalDocumentService } from '@pe/common-sdk';
import { ListDto } from '../dto';

@Injectable()
export class AdminLegalDocumentService extends LegalDocumentService {

  public async retrieveListForAdmin(
    query: ListDto,
  ): Promise<{ page: number; total: number; legalDocuments: LegalDocumentModel[] }> {

    const limit: number = query.limit * 1 || 100;
    const page: number = query.page * 1 || 1;
    const offset: number = (page - 1) * limit;

    const conditions: any = { };

    if (query.searchString) {
      conditions.$text = { $search: query.searchString };
    }

    const legalDocuments: LegalDocumentModel[] = await this.dataModel.find()
      .find(conditions)
      .select(query.projection)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    const total: number = await this.dataModel.count();

    return {
      legalDocuments,
      page,
      total,
    };
  }

  public async create(
    dto: LegalDocumentDto,
  ): Promise<LegalDocumentModel> {
    const legalDocument: LegalDocumentModel = await this.dataModel.findOne({
      _id: dto.id,
    });

    if (legalDocument) {
      throw new BadRequestException(
        `LegalDocument with id "${dto.id}" already exists`,
      );
    }

    return this.dataModel.create({
      _id: dto.id,
      ...dto,
    });
  }

  public async update(
    id: string,
    dto: Partial<LegalDocumentDto>,
  ): Promise<LegalDocumentModel> {
    return this.dataModel.findOneAndUpdate(
      { _id: id },
      { $set: { ...dto } },
      { new: true },
    );
  }

  public async delete(
    legalDocument: LegalDocumentModel,
  ): Promise<LegalDocumentModel> {
    legalDocument.delete();

    return legalDocument;
  }

}

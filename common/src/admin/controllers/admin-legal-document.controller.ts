import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LegalDocumentDto, LegalDocumentModel, LegalDocumentSchemaName } from '@pe/common-sdk';
import { JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { ListDto } from '../dto';
import { AdminLegalDocumentService } from '../services';
import { LEGAL_DOCUMENT_PLACEHOLDER } from './constants';

@Controller('admin/legal-document')
@ApiTags('LegalDocuments admin API reference')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
@ApiBearerAuth()
export class AdminLegalDocumentController {

  constructor(
    private readonly service: AdminLegalDocumentService,
  ) { }

  @Get(LEGAL_DOCUMENT_PLACEHOLDER)
  public async getOne(
    @ParamModel({ '_id': LEGAL_DOCUMENT_PLACEHOLDER }, LegalDocumentSchemaName) legalDocument: LegalDocumentModel,
  ): Promise<LegalDocumentModel> {
    return legalDocument;
  }

  @Get('/list')
  public async getMany(
    @Query(new ValidationPipe({ transform: true })) dto: ListDto,
  ): Promise<{ page: number; total: number; legalDocuments: LegalDocumentModel[] }> {
    return this.service.retrieveListForAdmin(dto);
  }

  @Post()
  public async create(
    @Body() dto: LegalDocumentDto,
  ): Promise<LegalDocumentModel> {
    return this.service.create(dto);
  }

  @Patch(LEGAL_DOCUMENT_PLACEHOLDER)
  public async update(
    @Param('legalDocumentId') legalDocumentId: string,
    @Body() dto: Partial<LegalDocumentDto>,
  ): Promise<LegalDocumentModel> {
    return this.service.update(legalDocumentId, dto);
  }

  @Delete(LEGAL_DOCUMENT_PLACEHOLDER)
  public async delete(
    @ParamModel({ '_id': LEGAL_DOCUMENT_PLACEHOLDER }, LegalDocumentSchemaName) legalDocument: LegalDocumentModel,
  ): Promise<LegalDocumentModel> {
    return this.service.delete(legalDocument);
  }

}

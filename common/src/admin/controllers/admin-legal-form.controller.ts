
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LegalFormDto, LegalFormModel, LegalFormSchemaName } from '@pe/common-sdk';
import { JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { ListDto } from '../dto';
import { AdminLegalFormService } from '../services';
import { LEGAL_FORM_PLACEHOLDER } from './constants';

@Controller('admin/legal-form')
@ApiTags('LegalForms admin API reference')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
@ApiBearerAuth()
export class AdminLegalFormController {

  constructor(
    private readonly service: AdminLegalFormService,
  ) { }

  @Get(LEGAL_FORM_PLACEHOLDER)
  public async getOne(
    @ParamModel({ '_id': LEGAL_FORM_PLACEHOLDER }, LegalFormSchemaName) legalForm: LegalFormModel,
  ): Promise<LegalFormModel> {
    return legalForm;
  }

  @Get('/list')
  public async getMany(
    @Query(new ValidationPipe({ transform: true })) dto: ListDto,
  ): Promise<{ page: number; total: number; legalForms: LegalFormModel[] }> {
    return this.service.retrieveListForAdmin(dto);
  }

  @Post()
  public async create(
    @Body() dto: LegalFormDto,
  ): Promise<LegalFormModel> {
    return this.service.create(dto);
  }

  @Patch(LEGAL_FORM_PLACEHOLDER)
  public async update(
    @Param('legalFormId') legalFormId: string,
    @Body() dto: Partial<LegalFormDto>,
  ): Promise<LegalFormModel> {
    return this.service.update(legalFormId, dto);
  }

  @Delete(LEGAL_FORM_PLACEHOLDER)
  public async delete(
    @ParamModel({ '_id': LEGAL_FORM_PLACEHOLDER }, LegalFormSchemaName) legalForm: LegalFormModel,
  ): Promise<LegalFormModel> {
    return this.service.delete(legalForm);
  }

}

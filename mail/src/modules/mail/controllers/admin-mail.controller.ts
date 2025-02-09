import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AbstractController, JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { MailSchemaName } from '../../mongoose-schema/mongoose-schema.names';
import { AdminCreateMailDto, AdminMailListDto, CreateMailDto } from '../dto';
import { MailInterface } from '../interfaces';
import { MailAccessConfigModel, MailModel } from '../models';
import { MailService } from '../services';

const MAIL_PLACEHOLDER: string = ':mailId';

@Controller('admin/mail')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
@ApiTags('admin')
@ApiBearerAuth()
export class AdminMailController extends AbstractController {

  constructor(
    private readonly mailService: MailService,
  ) {
    super();
  }

  @Get(MAIL_PLACEHOLDER)
  public async getOneMail(
    @ParamModel({ '_id': MAIL_PLACEHOLDER }, MailSchemaName) mail: MailModel,
  ): Promise<MailInterface> {
    return mail;
  }

  @Get('list')
  public async getAllMails(
    @Query(new ValidationPipe({ transform: true })) dto: AdminMailListDto,
  ): Promise<any[]> {
    return this.mailService.retrieveListForAdmin(dto);
  }

  @Post()
  public async create(
    @Body() dto: AdminCreateMailDto,
  ): Promise<any> {
    const createDto: CreateMailDto = { name: dto.name } as CreateMailDto;

    return this.mailService.create(dto.businessId, createDto);
  }

  @Patch(MAIL_PLACEHOLDER)
  public async update(
    @ParamModel({ '_id': MAIL_PLACEHOLDER }, MailSchemaName) mail: MailModel,
    @Body() dto: Partial<AdminCreateMailDto>,
  ): Promise<MailInterface> {
    const businessId: string = dto.businessId ? dto.businessId : mail.businessId;

    return this.mailService.update(mail, businessId, dto);
  }

  @Delete(MAIL_PLACEHOLDER)
  public async delete(
    @ParamModel({ '_id': MAIL_PLACEHOLDER }, MailSchemaName) mail: MailModel,
  ): Promise<{ mail: MailModel, access: MailAccessConfigModel }> {

    return this.mailService.delete(mail);
  }

}

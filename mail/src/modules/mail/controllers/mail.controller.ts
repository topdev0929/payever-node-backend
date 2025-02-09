import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AbstractController, Acl, AclActionsEnum, JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { BusinessModel } from '../../business/models';
import { BusinessSchemaName, MailSchemaName } from '../../mongoose-schema/mongoose-schema.names';
import { CreateMailDto } from '../dto';
import { MailAndAccessInterface } from '../interfaces';
import { MailModel } from '../models';
import { MailService } from '../services';

const BUSINESS_PLACEHOLDER: string = ':businessId';

@Controller('business/:businessId/mail')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
export class MailController extends AbstractController {
  constructor(
    private readonly mailsService: MailService,
  ) {
    super();
  }

  @Get()
  @Acl({ microservice: 'mail', action: AclActionsEnum.read })
  public async getBusinessMails(
    @ParamModel(BUSINESS_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
  ): Promise<any[]> {
    return this.mailsService.findWithAccessConfigByBusiness(business);
  }

  @Get(':mailId')
  @Acl({ microservice: 'mail', action: AclActionsEnum.read })
  @Roles(RolesEnum.anonymous)
  public async getByMail(
    @ParamModel(':mailId', MailSchemaName) mail: MailModel,
  ): Promise<any[]> {
    return this.mailsService.findWithAccessConfigByMail(mail);
  }

  @Get('isValidName')
  @Acl({ microservice: 'mail', action: AclActionsEnum.read })
  @Roles(RolesEnum.anonymous)
  public async isValidName(
    @ParamModel(BUSINESS_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @Query('name') name: string,
  ): Promise<{
    result: boolean;
    message?: string;
  }> {
    if (!name) {
      throw new Error(`Query param "name" is required`);
    }

    try {
      await this.mailsService.validateMailName(name, business._id);

      return { result: true };
    } catch (e) {
      return {
        message: (e && e.message) ? e.message : '',
        result: false,
      };
    }
  }

  @Post()
  @Acl({ microservice: 'mail', action: AclActionsEnum.create })
  public async createMail(
    @ParamModel(BUSINESS_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @Body() createMailDto: CreateMailDto,
  ): Promise<MailAndAccessInterface> {
    return this.mailsService.create(business._id, createMailDto);
  }
}

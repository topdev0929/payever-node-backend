import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import {
  AbstractController,
  Acl,
  AclActionsEnum,
  JwtAuthGuard,
  ParamModel,
  Roles,
  RolesEnum,
  User,
  UserTokenInterface,
} from '@pe/nest-kit';
import { UpdateAccessConfigDto } from '../dto';
import { MailSchemaName } from '../../mongoose-schema/mongoose-schema.names';
import { MailAccessConfigModel, MailModel } from '../models';
import { MailAccessConfigService } from '../services';

@Controller('business/:businessId/mail/access')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
export class MailAccessController extends AbstractController {
  constructor(
    private readonly mailAccessConfigsService: MailAccessConfigService,
  ) {
    super();
  }

  @Patch(':mailId')
  @Acl({ microservice: 'pos', action: AclActionsEnum.update })
  public async updateAccessConfig(
    @User() user: UserTokenInterface,
    @ParamModel(':mailId', MailSchemaName, true) mail: MailModel,
    @Body() dto: UpdateAccessConfigDto,
  ): Promise<MailAccessConfigModel> {
    return this.mailAccessConfigsService.createOrUpdate(mail, dto);
  }
}

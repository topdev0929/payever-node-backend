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
import { TerminalEditVoter } from '../voters';
import { TerminalSchemaName } from '../../mongoose-schema/mongoose-schema.names';
import { TerminalAccessConfigModel, TerminalModel } from '../models';
import { TerminalAccessConfigService } from '../services';

@Controller('business/:businessId/terminal/access')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
export class TerminalAccessController extends AbstractController {
  constructor(
    private readonly terminalAccessConfigsService: TerminalAccessConfigService,
  ) {
    super();
  }

  @Patch(':terminalId')
  @Acl({ microservice: 'pos', action: AclActionsEnum.update })
  public async updateAccessConfig(
    @User() user: UserTokenInterface,
    @ParamModel(':terminalId', TerminalSchemaName, true) terminal: TerminalModel,
    @Body() dto: UpdateAccessConfigDto,
  ): Promise<TerminalAccessConfigModel> {
    await this.denyAccessUnlessGranted(TerminalEditVoter.EDIT, terminal, user);

    return this.terminalAccessConfigsService.createOrUpdate(terminal, dto);
  }
}

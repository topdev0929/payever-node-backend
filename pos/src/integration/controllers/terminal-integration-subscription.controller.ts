import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Acl, AclActionsEnum, JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { BusinessModel } from '../../business/models';
import {
  BusinessSchemaName,
  IntegrationSchemaName,
  TerminalSchemaName,
} from '../../mongoose-schema/mongoose-schema.names';
import { TerminalModel } from '../../terminal/models';
import { IntegrationModel, IntegrationSubscriptionModel } from '../models';
import { TerminalIntegrationSubscriptionService } from '../services';

@Controller('business/:businessId/terminal/:terminalId/integration')
@ApiTags('terminalIntegration')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.merchant)
export class TerminalIntegrationSubscriptionController {
  constructor(private readonly terminalIntegrationService: TerminalIntegrationSubscriptionService) { }

  @Get()
  @Acl({ microservice: 'pos', action: AclActionsEnum.read })
  public async getIntegrations(
    @ParamModel('terminalId', TerminalSchemaName) terminal: TerminalModel,
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
  ): Promise<string[]> {
    const terminalSubscriptions: IntegrationSubscriptionModel[] =
      await this.terminalIntegrationService.getInstalledSubscriptions(terminal);

    return terminalSubscriptions.map((sub: IntegrationSubscriptionModel) => sub.integration.name);
  }

  @Patch(':integrationName/install')
  @Acl({ microservice: 'pos', action: AclActionsEnum.update })
  public async postIntegration(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel('terminalId', TerminalSchemaName) terminal: TerminalModel,
    @ParamModel({ name: 'integrationName' }, IntegrationSchemaName) integration: IntegrationModel,
  ): Promise<void> {
    await this.terminalIntegrationService.install(integration, terminal);
  }

  @Patch(':integrationName/uninstall')
  @Acl({ microservice: 'pos', action: AclActionsEnum.update })
  public async patchIntegration(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel('terminalId', TerminalSchemaName) terminal: TerminalModel,
    @ParamModel({ name: 'integrationName' }, IntegrationSchemaName) integration: IntegrationModel,
  ): Promise<void> {
    await this.terminalIntegrationService.uninstall(integration, terminal);
  }
}

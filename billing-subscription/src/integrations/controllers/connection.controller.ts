import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Acl, AclActionsEnum, JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { ConnectionModel } from '../models';
import { BusinessModel, BusinessSchemaName } from '../../business';
import { ConnectionService } from '../services';
import { ConnectionSchemaName } from '../schemas';
import { OutputConnectionInterface, IntegrationInterface } from '../interfaces';

const BUSINESS_ID_PLACEHOLDER: string = ':businessId';
const CONNECTION_ID_PLACEHOLDER: string = ':connectionId';

@Controller('business/:businessId/connection')
@ApiTags('ConnectionAPI')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.merchant)
export class ConnectionController {
  constructor(
    private readonly connectionService: ConnectionService,
  ) { }

  @Get()
  @Acl(
    { microservice: 'subscriptions', action: AclActionsEnum.read },
    { microservice: 'connect', action: AclActionsEnum.read },
  )
  public async getInstalledConnections(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
  ): Promise<OutputConnectionInterface[]> {
    const connections: ConnectionModel[] =
      await this.connectionService.getConnections(business);

    return connections
      .map((connection: ConnectionModel) => {
        return {
          _id: connection.id,

          integration: connection.integration,
          isEnabled: connection.isEnabled,
        };
      })
      .filter((a: { integration: IntegrationInterface }) => !!a.integration)
      .sort((a: { integration: IntegrationInterface }, b: { integration: IntegrationInterface }) => {
        if (a.integration.name < b.integration.name) {
          return -1;
        }
        if (a.integration.name > b.integration.name) {
          return 1;
        }

        return 0;
      })
    ;
  }

  @Patch(':connectionId/install')
  @Acl(
    { microservice: 'subscriptions', action: AclActionsEnum.update },
    { microservice: 'connect', action: AclActionsEnum.update },
  )
  public async installConnectionToCheckout(
    @ParamModel(CONNECTION_ID_PLACEHOLDER, ConnectionSchemaName) connection: ConnectionModel,
  ): Promise<void> {

    await this.connectionService.enableConnection(connection);
  }

  @Patch(':connectionId/uninstall')
  @Acl(
    { microservice: 'subscriptions', action: AclActionsEnum.update },
    { microservice: 'connect', action: AclActionsEnum.update },
  )
  public async uninstallConnectionFromCheckout(
    @ParamModel(CONNECTION_ID_PLACEHOLDER, ConnectionSchemaName) connection: ConnectionModel,
  ): Promise<void> {
    await this.connectionService.disableConnection(connection);
  }
}

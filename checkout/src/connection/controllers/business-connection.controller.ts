import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Acl, AclActionsEnum, JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { BusinessModel } from '../../business';
import { BusinessSchemaName } from '../../mongoose-schema';
import { OutputConnectionInterface } from '../interfaces';
import { ConnectionModel } from '../models';
import { ConnectionService } from '../services';

const BUSINESS_ID_PLACEHOLDER: string = ':businessId';

@Controller('business/:businessId/connection')
@ApiTags('checkoutIntegration')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.merchant)
export class BusinessConnectionController {
  constructor(
    private readonly connectionService: ConnectionService,
  ) { }

  @Get()
  @Acl({ microservice: 'checkout', action: AclActionsEnum.read })
  public async getBusinessConnections(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
  ): Promise<OutputConnectionInterface[]> {
    const connections: ConnectionModel[] =
      await this.connectionService.findAllByBusiness(business);

    return connections
      .filter((connection: ConnectionModel) =>
        connection.isBpoActive === undefined || connection.isBpoActive,
      )
      .map((connection: ConnectionModel) => {
        return {
          _id: connection.id,
          name: connection.name,

          integration: connection.integration.name,
        };
      })
      .sort((a: { integration: string }, b: { integration: string }) => {
        if (a.integration < b.integration) {
          return -1;
        }
        if (a.integration > b.integration) {
          return 1;
        }

        return 0;
      })
    ;
  }
}

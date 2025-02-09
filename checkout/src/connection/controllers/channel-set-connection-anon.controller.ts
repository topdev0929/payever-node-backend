import { Header, Controller, Get, NotFoundException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { ChannelSetModel } from '../../channel-set/models';
import { CheckoutModel } from '../../checkout/models';
import { IntegrationModel } from '../../integration/models';
import {
  ChannelSetSchemaName,
  IntegrationSchemaName,
} from '../../mongoose-schema';
import { OutputConnectionInterface } from '../interfaces';
import { ConnectionModel } from '../models';
import { CheckoutConnectionService } from '../services';

const CHANNEL_SET_ID_PLACEHOLDER: string = ':channelSetId';
const INTEGRATION_NAME_PLACEHOLDER: string = ':integrationName';

@Controller(`channel-set/${CHANNEL_SET_ID_PLACEHOLDER}`)
@ApiTags('channelSetConnection')
@Roles(RolesEnum.anonymous)
export class ChannelSetConnectionAnonController {
  constructor(
    private readonly checkoutConnectionService: CheckoutConnectionService,
  ) { }

  @Get(`default-connection/${INTEGRATION_NAME_PLACEHOLDER}`)
  @Header('Cache-Control', 'max-age=3600, public, s-maxage=3600')
  public async getConnectionsByCheckoutIdAndIntegrationName(
    @ParamModel(CHANNEL_SET_ID_PLACEHOLDER, ChannelSetSchemaName) channelSet: ChannelSetModel,
    @ParamModel(
      {
        name: INTEGRATION_NAME_PLACEHOLDER,
      },
      IntegrationSchemaName,
    ) integration: IntegrationModel,
  ): Promise<OutputConnectionInterface> {
    await channelSet.populate('checkout').execPopulate();
    const checkout: CheckoutModel = channelSet.checkout;

    const connections: ConnectionModel[] =
      await this.checkoutConnectionService.getConnections(checkout);

    const integrationConnections: ConnectionModel[] = connections
      .filter((connection: ConnectionModel) => {
        return connection.integration.id === integration.id;
      });

    if (!integrationConnections.length) {
      throw new NotFoundException(`Connections not found for integration '${integration.name}'`);
    }

    let defaultConnection: ConnectionModel =
      integrationConnections.find((connection: ConnectionModel) => {
        return !connection.name;
      });

    if (!defaultConnection) {
      defaultConnection = integrationConnections.shift();
    }

    return {
      _id: defaultConnection.id,
      name: defaultConnection.name,

      integration: defaultConnection.integration.name,
    };
  }
}

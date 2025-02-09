import { Injectable, Logger } from '@nestjs/common';
import { Command, Option } from '@pe/nest-kit';
import { Model } from 'mongoose';
import { ConnectionService } from '../services';
import { ConnectionModel } from '../models';
import { BusinessService } from '@pe/business-kit/modules';
import { IntegrationService } from '../../integration/services';
import { BusinessModel } from '../../business/models';
import { IntegrationModel } from '../../integration/models';
import { ConnectionOptionsInterface } from '../interfaces';

@Injectable()
export class AssignCustomAmountCommand {
  constructor(
    private businessService: BusinessService,
    private integrationService: IntegrationService,
    private connectionService: ConnectionService,
  ) { }

  @Command({
    command: 'checkout:connection:assign-amount [--connection_id] [--business_id] [--integration] [--min] [--max]',
    describe: 'Assign custom amount by specific connection id OR by business_id/integration pair',
  })
  public async export(
    @Option({ name: 'connection_id' }) connectionId: string,
    @Option({ name: 'business_id' }) businessId: string,
    @Option({ name: 'integration' }) integration: string,
    @Option({ name: 'min' }) min: number,
    @Option({ name: 'max' }) max: number,
  ): Promise<void> {
    if (!min || !max || min >= max) {
      Logger.log('Wrong min/max params');

      return;
    }

    if (connectionId) {
      const connection: ConnectionModel = await this.connectionService.findById(connectionId);
      await this.processSingleConnection(connection, min, max);

      return;
    }

    if (!businessId || !integration) {
      Logger.log('Missing "business_id" or "integration" params');

      return;
    }

    const business: BusinessModel = await this.businessService.findOneById(businessId) as BusinessModel;
    const integrationModel: IntegrationModel = await this.integrationService.findOneByName(integration);
    if (!business) {
      Logger.log(`Business not found by id "${businessId}"`);

      return;
    }
    if (!integrationModel) {
      Logger.log(`Integration not found by name "${integration}"`);

      return;
    }

    const connections: ConnectionModel[] =
      await this.connectionService.findAllByBusinessAndIntegration(business, integrationModel);
    Logger.log(`Found ${connections.length} connections`);

    for (const connection of connections) {
      await this.processSingleConnection(connection, min, max);
    }
  }

  private async processSingleConnection(
    connection: ConnectionModel,
    min: number,
    max: number,
  ): Promise<void> {
    Logger.log(`Processing connection with id ${connection.id}`);

    const options: ConnectionOptionsInterface = connection.options;
    Logger.log(`Old connection options: ${JSON.stringify(options, null, 2)}.`);

    options.minAmount = min;
    options.maxAmount = max;

    await this.connectionService.updateOptions(connection.id, options);
    Logger.log(`New connection options: ${JSON.stringify(options, null, 2)}.`);
    Logger.log(`Finished processing connection with id ${connection.id}`);
    Logger.log(``);
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { Command, Option } from '@pe/nest-kit';
import { Model } from 'mongoose';
import { ConnectionService } from '../../connection/services';
import { ConnectionModel } from '../../connection/models';
import { BusinessService } from '@pe/business-kit/modules';
import { IntegrationService } from '../../integration/services';
import { BusinessModel } from '../../business/models';
import { IntegrationModel } from '../../integration/models';
import { ConnectionOptionsInterface } from '../../connection/interfaces';
import { CheckoutService } from '../services';
import { CheckoutModel } from '../models';
import { CheckoutSettingsInterface } from '../interfaces';

@Injectable()
export class SwitchConnectionVersionCommand {
  constructor(
    private businessService: BusinessService,
    private integrationService: IntegrationService,
    private connectionService: ConnectionService,
    private checkoutService: CheckoutService,
  ) { }

  @Command({
    command: 'checkout:connection:set-version [--connection_id] [--business_id] [--integration] [--version_name]',
    describe: 'Sets specific connection version',
  })
  public async export(
    @Option({ name: 'connection_id' }) connectionId: string,
    @Option({ name: 'business_id' }) businessId: string,
    @Option({ name: 'integration' }) integration: string,
    @Option({ name: 'version_name' }) version: string,
  ): Promise<void> {
    if (connectionId) {
      const connection: ConnectionModel = await this.connectionService.findById(connectionId);
      await this.processSingleConnection(connection, version);

      return;
    }

    if (!businessId || !version) {
      Logger.log('Missing "business_id" or "version" params');

      return;
    }

    const business: BusinessModel = await this.businessService.findOneById(businessId) as BusinessModel;
    if (!business) {
      Logger.log(`Business not found by id "${businessId}"`);

      return;
    }

    if (!integration) {
      await this.processSingleBusiness(business, version);

      return;
    }

    const integrationModel: IntegrationModel = await this.integrationService.findOneByName(integration);
    if (!integrationModel) {
      Logger.log(`Integration not found by name "${integration}"`);
    }

    const connections: ConnectionModel[] =
      await this.connectionService.findAllByBusinessAndIntegration(business, integrationModel);
    Logger.log(`Found ${connections.length} connections`);

    for (const connection of connections) {
      await this.processSingleConnection(connection, version);
    }
  }

  private async processSingleConnection(
    connection: ConnectionModel,
    version: string,
  ): Promise<void> {
    Logger.log(`Processing connection with id ${connection.id}`);

    const options: ConnectionOptionsInterface = connection.options;
    Logger.log(`Old connection options: ${JSON.stringify(options, null, 2)}.`);

    options.version = version;

    await this.connectionService.updateOptions(connection.id, options);
    Logger.log(`New connection options: ${JSON.stringify(options, null, 2)}.`);
    Logger.log(`Finished processing connection with id ${connection.id}`);
    Logger.log(``);
  }

  private async processSingleBusiness(
    business: BusinessModel,
    version: string,
  ): Promise<void> {
    Logger.log(`Processing single business with id ${business.id}`);

    const checkouts: CheckoutModel[] = await this.checkoutService.findAllByBusiness(business);
    for (const checkout of checkouts) {
      const settings: CheckoutSettingsInterface = checkout.settings;
      settings.version = version;
      await this.checkoutService.updateSettings(checkout, settings);
    }

    Logger.log(`Successfully updated ${checkouts.length} checkouts`);
    Logger.log(`Finished processing business with id ${business.id}`);
    Logger.log(``);
  }
}

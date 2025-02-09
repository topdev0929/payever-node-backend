import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query } from 'mongoose';
import { PendingInstallationSchemaName, TerminalIntegrationSubSchemaName } from '../../mongoose-schema/mongoose-schema.names';
import { TerminalModel } from '../../terminal';
import { IntegrationSubscriptionInterface, PendingInstallationInterface, SetupTerminalInterface } from '../interfaces';
import { IntegrationModel, IntegrationSubscriptionModel, PendingInstallationModel } from '../models';
import { BusinessModel } from '@pe/business-kit';
import { IntegrationService } from './integration.service';

@Injectable()
export class TerminalIntegrationSubscriptionService {
  constructor(
    @InjectModel(TerminalIntegrationSubSchemaName)
      private readonly subscriptionModel: Model<IntegrationSubscriptionModel>,
    @InjectModel(PendingInstallationSchemaName)
      private readonly pendingInstallationModel: Model<PendingInstallationModel>,
    private readonly integrationService: IntegrationService,
  ) { }

  public async install(
    integration: IntegrationModel,
    terminal: TerminalModel,
  ): Promise<IntegrationSubscriptionModel> {
    const subscription: IntegrationSubscriptionModel = await this.findOrCreateSubscription(integration, terminal);
    const updatedSubscription: IntegrationSubscriptionModel = await this.subscriptionModel.findOneAndUpdate(
      { _id: subscription.id },
      { installed: true },
      { new: true },
    );

    await updatedSubscription.populate('integration').execPopulate();

    return updatedSubscription;
  }

  public async uninstall(
    integration: IntegrationModel,
    terminal: TerminalModel,
  ): Promise<IntegrationSubscriptionModel> {
    const subscription: IntegrationSubscriptionModel = await this.findOrCreateSubscription(integration, terminal);
    const updatedSubscription: IntegrationSubscriptionModel = await this.subscriptionModel.findOneAndUpdate(
      { _id: subscription.id },
      { installed: false },
      { new: true },
    );

    await updatedSubscription.populate('integration').execPopulate();

    return updatedSubscription;
  }

  public async addPendingInstallation(data: PendingInstallationInterface): Promise<void> {
    await this.pendingInstallationModel.create(data);
  }

  public async processPendingInstallment(business: BusinessModel, terminal: TerminalModel): Promise<void> {
    const pendingInstallation: PendingInstallationModel = 
    await this.pendingInstallationModel.findOne({ businessId: business._id });

    if (!pendingInstallation) {
      return;
    }
    await this.setupTerminal(pendingInstallation.payload, terminal);
    await this.pendingInstallationModel.deleteOne({ businessId: business._id });
  }

  public async setupTerminal(
    data: SetupTerminalInterface, 
    terminal: TerminalModel,
  ): Promise<void> {
    const { integrationsToInstall }: any = data;

    for (const integrationName of integrationsToInstall) {
      const integration: IntegrationModel = await this.integrationService.findOneByName(integrationName);
      await this.install(integration, terminal);
    }
  }

  public async findOneById(id: string): Promise<IntegrationSubscriptionModel> {
    const subscription: IntegrationSubscriptionModel = await this.subscriptionModel.findById(id);
    await subscription.populate('integration').execPopulate();

    return subscription;
  }

  public async findByCategory(
    terminal: TerminalModel,
    category: string,
  ): Promise<IntegrationSubscriptionModel[]> {
    await terminal.populate('integrationSubscriptions').execPopulate();

    const subscriptions: IntegrationSubscriptionModel[] = terminal.integrationSubscriptions.filter(
      (record: IntegrationSubscriptionModel) => record.integration.category === category,
    );

    return subscriptions.sort((a: IntegrationSubscriptionModel, b: IntegrationSubscriptionModel) => {
      if (a.integration.name < b.integration.name) {
        return -1;
      }
      if (a.integration.name > b.integration.name) {
        return 1;
      }

      return 0;
    });
  }

  public async getAllSubscriptions(terminal: TerminalModel): Promise<IntegrationSubscriptionModel[]> {
    await terminal.populate('integrationSubscriptions').execPopulate();
    await terminal.populate('integrationSubscriptions.integration').execPopulate();

    return terminal.integrationSubscriptions;
  }

  public async getInstalledSubscriptions(terminal: TerminalModel): Promise<IntegrationSubscriptionModel[]> {
    await terminal.populate('integrationSubscriptions').execPopulate();
    await terminal.populate('integrationSubscriptions.integration').execPopulate();

    const terminalSubscriptions: IntegrationSubscriptionModel[] = terminal.integrationSubscriptions;

    return terminalSubscriptions.filter((sub: IntegrationSubscriptionModel) => sub.installed);
  }

  public async deleteAllByTerminal(terminal: TerminalModel): Promise<void> {
    await terminal.populate('integrationSubscriptions').execPopulate();

    const tasks: Array<Query<any, any>> = [];
    for (const subscription of terminal.integrationSubscriptions) {
      tasks.push(this.subscriptionModel.deleteOne({ _id: subscription.id }));
    }

    await Promise.all(tasks);
  }

  private async findOrCreateSubscription(
    integration: IntegrationModel,
    terminal: TerminalModel,
  ): Promise<IntegrationSubscriptionModel> {
    await terminal.populate('integrationSubscriptions').execPopulate();

    let subscription: IntegrationSubscriptionModel = terminal.integrationSubscriptions.find(
      (record: IntegrationSubscriptionModel) => record.integration === integration._id,
    );

    if (!subscription) {
      const subscriptionDto: IntegrationSubscriptionInterface = {
        installed: false,
        integration: integration,
      };

      subscription = await this.subscriptionModel.create(subscriptionDto as IntegrationSubscriptionModel);
      terminal.integrationSubscriptions.push(subscription);
      await terminal.save();
    }

    await subscription.populate('integration').execPopulate();

    return subscription;
  }
}

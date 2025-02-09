import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessModel } from '../../business/models';
import { CheckoutModel } from '../../checkout/models';
import { BusinessIntegrationSubscriptionService, IntegrationCategory } from '../../integration';
import { CheckoutSchemaName } from '../../mongoose-schema';
import { ConnectionModel } from '../models';
import { CheckoutConnectionRabbitProducer } from '../rabbit-producers';
import { ConnectionService } from './connection.service';
import { SortOrderConnectionDto } from '../dto/sort-order-connection.dto';

@Injectable()
export class CheckoutConnectionService {
  constructor(
    @InjectModel(CheckoutSchemaName) private readonly checkoutModel: Model<CheckoutModel>,
    private businessIntegrationService: BusinessIntegrationSubscriptionService,
    private checkoutConnectionRabbitProducer: CheckoutConnectionRabbitProducer,
    private connectionService: ConnectionService,
  ) { }

  public async install(
    connection: ConnectionModel,
    checkout: CheckoutModel,
  ): Promise<void> {
    checkout.depopulate('connections');
    if (checkout.connections.indexOf(connection.id) !== -1) {
      return;
    }
    const updated: CheckoutModel = await this.checkoutModel.findOneAndUpdate(
      { _id: checkout.id },
      { $push: { connections: connection.id }},
      { new: true },
    );

    await this.checkoutConnectionRabbitProducer.checkoutConnectionInstalled(connection, updated);
  }

  public async uninstall(
    connection: ConnectionModel,
    checkout: CheckoutModel,
  ): Promise<void> {
    checkout.depopulate('connections');
    if (checkout.connections.indexOf(connection.id) === -1) {
      return;
    }
    const updated: CheckoutModel = await this.checkoutModel.findOneAndUpdate(
      { _id: checkout.id },
      { $pull: { connections: connection.id }},
      { new: true },
    );

    await this.checkoutConnectionRabbitProducer.checkoutConnectionUninstalled(connection, updated);
  }

  public async getConnections(checkout: CheckoutModel): Promise<ConnectionModel[]> {
    await checkout.populate('connections').execPopulate();
    await checkout.populate('connections.integration').execPopulate();

    return checkout.connections;
  }

  public async getInstalledConnections(
    checkout: CheckoutModel,
    business: BusinessModel,
  ): Promise<ConnectionModel[]> {
    const checkoutConnections: ConnectionModel[] = await this.getConnections(checkout);

    const businessConnections: ConnectionModel[] = await this.connectionService.findAllByBusiness(business);
    const outOfCheckoutConnections: ConnectionModel[] = businessConnections.filter(
      (connection: ConnectionModel) => connection.integration.category === IntegrationCategory.Shippings,
    );

    const merged: ConnectionModel[] = [
      ...checkoutConnections,
      ...outOfCheckoutConnections,
    ];

    const result: ConnectionModel[] = [];
    const map: Map<string, boolean> = new Map();
    for (const connection of merged) {
      if (!map.has(connection.id)) {
        map.set(connection.id, true);
        result.push(connection);
      }
    }

    return this.sortBySortOrder(result);
  }

  public async sortOrderConnections(
    checkout: CheckoutModel,
    business: BusinessModel,
    sortOrderDtos: SortOrderConnectionDto[],
  ): Promise<ConnectionModel[]> {
    const connections: ConnectionModel[] = await this.getInstalledConnections(checkout, business);
    for await (const connection of connections) {
      const sortOrderDto = sortOrderDtos.find(w => w.connectionId === connection._id);
      connection.options.sortOrder = sortOrderDto?.sortOrder;
      connection.markModified('options');
      await connection.save();
    }

    return this.sortBySortOrder(connections);
  }

  private sortBySortOrder(connections: ConnectionModel[]) {
    return connections.sort(
      (first: ConnectionModel, second: ConnectionModel) =>
        (first.options?.sortOrder || first.integration.sortOrder || Number.MAX_SAFE_INTEGER) -
        (second.options?.sortOrder || second.integration.sortOrder || Number.MAX_SAFE_INTEGER)
    );
  }
}

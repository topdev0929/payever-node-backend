import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConnectionModel, IntegrationModel } from '../models';
import { BusinessModel } from '../../business';
import { ConnectionSchemaName } from '../schemas';
import { ConnectionRmqMessageDto } from '../dtos';
import { EventDispatcher } from '@pe/nest-kit';
import { PaymentMethodsEnum } from '../../subscriptions/enums';
import { ConnectionEventsEnum } from '../enums';

@Injectable()
export class ConnectionService {
  constructor(
    @InjectModel(ConnectionSchemaName) private readonly dataModel: Model<ConnectionModel>,
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  public async createConnection(
    businessModel: BusinessModel,
    integration: IntegrationModel,
    integrationName: string,
    connection: ConnectionRmqMessageDto,
  ): Promise<ConnectionModel> {
    return this.dataModel.findOneAndUpdate(
      {
        _id: connection.id,
      },
      {
        businessId: businessModel._id,
        integration,
        integrationName: PaymentMethodsEnum[integrationName],
        isEnabled: connection.isEnabled,
      },
      {
        new: true,
        setDefaultsOnInsert: true,
        upsert: true,
      },
    );
  }

  public async removeConnection(businessModel: BusinessModel, connectionId: string): Promise<ConnectionModel> {
    const connection: ConnectionModel = await this.dataModel.findOne({
      _id: connectionId,
      businessId: businessModel._id,
    });

    if (!connection) {
      return;
    }

    await this.eventDispatcher.dispatch(ConnectionEventsEnum.ConnectionRemoved, connection);

    return this.dataModel.findOneAndDelete({
      _id: connectionId,
      businessId: businessModel._id,
    });
  }

  public async enableConnection(connection: ConnectionModel): Promise<ConnectionModel> {
    if (connection.isEnabled) {
      return connection;
    }

    connection.isEnabled = true;

    await this.eventDispatcher.dispatch(ConnectionEventsEnum.ConnectionEnabled, connection);
    await connection.save();
  }

  public async disableConnection(connection: ConnectionModel): Promise<ConnectionModel> {
    if (!connection.isEnabled) {
      return connection;
    }

    connection.isEnabled = false;

    await this.eventDispatcher.dispatch(ConnectionEventsEnum.ConnectionDisabled, connection);
    await connection.save();
  }

  public async getEnabledConnections(business: BusinessModel): Promise<ConnectionModel[]> {
    return this.dataModel.find({
      businessId: business.id,
      isEnabled: true,
    }).populate('integration');
  }

  public async getConnections(business: BusinessModel): Promise<ConnectionModel[]> {
    return this.dataModel.find({
      businessId: business.id,
    }).populate('integration');
  }

  public async removeConnectionsByIntegrationName(
    business: BusinessModel,
    integrationName: PaymentMethodsEnum,
  ): Promise<void> {
    const connections: ConnectionModel[] = await this.dataModel.find({
      businessId: business.id,
      integrationName,
    });

    for (const connection of connections) {
      await this.removeConnection(business, connection.id);
    }
  }
}

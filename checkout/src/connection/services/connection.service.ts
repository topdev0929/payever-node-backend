import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessModel } from '../../business/models';
import { IntegrationModel } from '../../integration/models';
import { ConnectionSchemaName } from '../../mongoose-schema';
import { ConnectionInterface, ConnectionOptionsInterface } from '../interfaces';
import { ConnectionModel } from '../models';

@Injectable()
export class ConnectionService {
  constructor(
    @InjectModel(ConnectionSchemaName) private readonly connectionModel: Model<ConnectionModel>,
    private readonly logger: Logger,
  ) { }

  public async create(
    data: ConnectionInterface & { _id: string },
  ): Promise<ConnectionModel> {
    const connection: ConnectionModel = await this.connectionModel.create(data as ConnectionModel);

    this.logger.log({
      message: `Created Connection '${connection.id}'`,

      business: connection.businessId,
      integration: connection.integration,
      name: connection.name,
    });

    return connection;
  }

  public async upsert(
    data: ConnectionInterface & { _id: string },
  ): Promise<ConnectionModel> {
    return this.connectionModel.findOneAndUpdate(
      { _id: data._id },
      { $set: data },
      { new: true, upsert: true },
    );
  }

  public async updateOptions(
    connectionId: string,
    options: ConnectionOptionsInterface,
  ): Promise<ConnectionModel> {
    return this.connectionModel.findOneAndUpdate(
      { _id: connectionId },
      { $set: { options }},
    );
  }

  public async findById(id: string): Promise<ConnectionModel> {
    return this.connectionModel.findById(id);
  }

  public async removeById(id: string): Promise<void> {
    const connection: ConnectionModel = await this.connectionModel.findByIdAndRemove(id);

    this.logger.log({
      message: `Removed Connection '${connection.id}'`,

      business: connection.businessId,
      integration: connection.integration,
      name: connection.name,
    });
  }

  public async findAllByBusiness(
    business: BusinessModel,
  ): Promise<ConnectionModel[]> {
    return this.connectionModel
      .find({
        businessId: business.id,
      })
      .populate('integration')
    ;
  }

  public async findAllByBusinessId(
    businessId: string,
  ): Promise<ConnectionModel[]> {
    return this.connectionModel
      .find({
        businessId,
      })
      .populate('integration')
      ;
  }

  public async findAllByBusinessAndIntegration(
    business: BusinessModel,
    integration: IntegrationModel,
  ): Promise<ConnectionModel[]> {
    return this.connectionModel
      .find({
        businessId: business.id,
        integration: integration.id,
      })
      .populate('integration')
    ;
  }

  public async findAllByBusinessAndIntegrationsList(
    business: BusinessModel,
    integrations: IntegrationModel[],
  ): Promise<ConnectionModel[]> {
    return this.connectionModel
      .find({
        businessId: business.id,
        integration: { $in: integrations },
      })
      .populate('integration')
      ;
  }
}

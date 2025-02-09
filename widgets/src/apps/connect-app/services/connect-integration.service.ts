import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConnectIntegrationModel, ConnectIntegrationSubscriptionModel } from '../models';
import { Model } from 'mongoose';
import { ConnectIntegrationSchemaName, ConnectIntegrationSubscriptionSchemaName } from '../schemas';
import { ConnectIntegrationEventDto } from '../dtos';

@Injectable()
export class ConnectIntegrationService {
  constructor(
    @InjectModel(ConnectIntegrationSchemaName) private readonly connectIntegrationModel: Model<ConnectIntegrationModel>,
    @InjectModel(ConnectIntegrationSubscriptionSchemaName)
    private readonly connectIntegrationSubscriptionModel: Model<ConnectIntegrationSubscriptionModel>,
  ) { }

  public async findExceptIds(ids: string[]): Promise<ConnectIntegrationModel[]> {
    return this.connectIntegrationModel.find(
      {
        _id: { $nin : ids },
      },
    );
  }

  public async findOneAndUpdate(data: ConnectIntegrationEventDto): Promise<ConnectIntegrationModel> {
    return this.connectIntegrationModel.findOneAndUpdate(
      { _id: data._id },
      {
        $set: {
          category: data.category,
          connect: data.connect,
          displayOptions: data.displayOptions,
          installationOptions: data.installationOptions,
          name: data.name,
        },
      },
      { new: true, upsert: true },
    );
  }

  public async deleteById(integrationId: string): Promise<void> {
    await this.connectIntegrationModel.deleteOne(
      { _id: integrationId },
    ).exec();
  }

}

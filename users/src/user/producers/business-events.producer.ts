import { Injectable, Logger } from '@nestjs/common';
import { RabbitMqClient, RabbitMqRPCClient } from '@pe/nest-kit';

import { BusinessModel, UserModel } from '../models';
import { BusinessRabbitMessagesEnum, BusinessRabbitSecretMessagesEnum } from '../enums';
import { EmailSettingsModel } from '../models/email-settings.model';

@Injectable()
export class BusinessEventsProducer {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
    private readonly rabbitMqRPCClient: RabbitMqRPCClient,
    private readonly logger: Logger,
  ) { }

  public async produceBusinessCreatedEvent(user: UserModel, business: BusinessModel): Promise<void> {
    const businessObject: any = business.toObject();

    await this.rabbitClient.send(
      {
        channel: BusinessRabbitMessagesEnum.BusinessCreated,
        exchange: 'async_events',
      },
      {
        name: BusinessRabbitMessagesEnum.BusinessCreated,
        payload: {
          userAccount: user.userAccount,
          userAccountId: user.id,
          ...businessObject,
          ...businessObject.businessDetail,
        },
      },
      true
    );

    await this.sendRPCCall(
      {
        userAccount: user.userAccount,
        userAccountId: user.id,
        ...businessObject,
        ...businessObject.businessDetail,
      },
      BusinessRabbitMessagesEnum.RpcBusinessCreated,
    );
  }

  public async produceBusinessUpdatedEvent(user: UserModel, business: BusinessModel): Promise<void> {
    await business.populate('businessDetail').execPopulate();
    const businessObject: any = business.toObject();

    await this.rabbitClient.send(
      {
        channel: BusinessRabbitMessagesEnum.BusinessUpdated,
        exchange: 'async_events',
      },
      {
        name: BusinessRabbitMessagesEnum.BusinessUpdated,
        payload: {
          userAccount: user.userAccount,
          userAccountId: user.id,
          ...businessObject.businessDetail,
          ...businessObject,
        },
      },
      true
    );
  }

  public async produceBusinessOwnerMigrateEvent(business: BusinessModel): Promise<void> {
    await business.populate('businessDetail').execPopulate();
    await business.populate('owner').execPopulate();
    const businessObject: any = business.toObject();

    await this.rabbitClient.send(
      {
        channel: BusinessRabbitMessagesEnum.BusinessOwnerMigrate,
        exchange: 'async_events',
      },
      {
        name: BusinessRabbitMessagesEnum.BusinessOwnerMigrate,
        payload: {
          _id: businessObject._id,
          userAccountId: businessObject?.owner?._id,
        },
      },
      true
    );
  }

  public async produceBusinessOwnerTransferEvent(business: BusinessModel, previousOwnerId: string): Promise<void> {
    await business.populate('businessDetail').execPopulate();
    await business.populate('owner').execPopulate();
    const businessObject: any = business.toObject();

    await this.rabbitClient.send(
      {
        channel: BusinessRabbitMessagesEnum.BusinessOwnerTransfer,
        exchange: 'async_events',
      },
      {
        name: BusinessRabbitMessagesEnum.BusinessOwnerTransfer,
        payload: {
          businessId: businessObject._id,
          newOwnerId: businessObject?.owner?._id,
          previousOwnerId,
        },
      },
      true
    );
  }

  public async produceBusinessExportEvent(business: BusinessModel): Promise<void> {
    await business.populate('businessDetail').execPopulate();
    await business.populate('owner').execPopulate();
    const businessObject: any = business.toObject();

    await this.rabbitClient.send(
      {
        channel: BusinessRabbitMessagesEnum.BusinessExport,
        exchange: 'async_events',
      },
      {
        name: BusinessRabbitMessagesEnum.BusinessExport,
        payload: {
          userAccount: businessObject?.owner?.userAccount,
          userAccountId: businessObject?.owner?.id,
          ...businessObject,
          ...businessObject.businessDetail,
        },
      },
      true
    );
  }

  public async produceBusinessRemovedEvent(user: UserModel, business: BusinessModel): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: BusinessRabbitMessagesEnum.BusinessRemoved,
        exchange: 'async_events',
      },
      {
        name: BusinessRabbitMessagesEnum.BusinessRemoved,
        payload: {
          _id: business._id,
          name: business.name,
          userAccount: user.userAccount,
          userAccountId: user.id,
        },
      },
      true
    );
  }

  public async produceBusinessSecretEmailSettingsUpdatedEvent(
    business: BusinessModel,
    emailSettings: EmailSettingsModel,
  ): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: BusinessRabbitSecretMessagesEnum.BusinessEmailSettingsUpdated,
        exchange: 'async_events',
      },
      {
        name: BusinessRabbitSecretMessagesEnum.BusinessEmailSettingsUpdated,
        payload: {
          business: business.toObject(),
          emailSettings: emailSettings.toObject(),
        },
      },
      true
    );
  }

  private async sendRPCCall(payload: any, eventName: string): Promise<void> {
    await this.rabbitMqRPCClient.send(
      {
        channel: eventName,
        exchange: 'async_events',
      },
      {
        name: eventName,
        payload,
      },
      {
        responseType: 'json',
      },
    ).catch((error: any) => {
      this.logger.error(
        {
          data: payload,
          error: error.message,
          message: 'Failed users RPC call',
          routingKey: eventName,
        },
        error.stack,
        'BusinessEventsProducer',
      );
    });
  }
}

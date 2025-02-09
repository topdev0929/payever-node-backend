import { Injectable } from '@nestjs/common';
import { PactRabbitMqMessageProvider, AbstractMessageMock } from '@pe/pact-kit';
import { BusinessRabbitMessagesEnum } from '../../../src/user/enums';
import { BusinessEventsProducer } from '../../../src/user/producers';
import { BusinessModel, UserModel, UserAccountModel } from '../../../src/user/models';
import * as uuid from 'uuid';
const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

@Injectable()
export class BusinessMessagesMock extends AbstractMessageMock {
  private populate = () => {
    return {
      execPopulate: () => {
        return new Promise((resolve) => {
          resolve({});
        });
      },
    };
  };

  private business = {
    populate: this.populate,
    // tslint:disable-next-line: no-identical-functions
    toObject: (): any => {
      return {
        _id: BUSINESS_ID,
        companyAddress: {
          city: 'Berlin',
          country: 'DE',
          street: 'some street',
          zipCode: '1234',
        },
        companyDetails: {
          industry: 'Some Industry',
          product: 'Some Product',
        },
        createdAt: new Date().toISOString(),
        currency: 'EUR',
        name: 'test',
        themeSettings: {
          theme: 'default',
        },
        userAccountId: uuid.v4(),
      };
    },
  } as unknown as BusinessModel;

  private user = {
    id: uuid.v4(),
    userAccount: {
      id: uuid.v4(),
    } as UserAccountModel,
  } as UserModel;

  @PactRabbitMqMessageProvider(BusinessRabbitMessagesEnum.RpcBusinessCreated)
  public async mockBusinessCreatedRpc(): Promise<void> {
    const producer: BusinessEventsProducer = await this.getProvider<BusinessEventsProducer>(BusinessEventsProducer);
    await producer.produceBusinessCreatedEvent(this.user, this.business);
  }

  @PactRabbitMqMessageProvider(BusinessRabbitMessagesEnum.BusinessCreated)
  public async mockBusinessCreated(): Promise<void> {
    const producer: BusinessEventsProducer = await this.getProvider<BusinessEventsProducer>(BusinessEventsProducer);
    await producer.produceBusinessCreatedEvent(this.user, this.business);
  }

  @PactRabbitMqMessageProvider(BusinessRabbitMessagesEnum.BusinessUpdated)
  public async mockBusinessUpdated(): Promise<void> {
    const producer: BusinessEventsProducer = await this.getProvider<BusinessEventsProducer>(BusinessEventsProducer);
    await producer.produceBusinessUpdatedEvent({} as UserModel, this.business);
  }

  @PactRabbitMqMessageProvider(BusinessRabbitMessagesEnum.BusinessRemoved)
  public async mockBusinessRemoved(): Promise<void> {
    const producer: BusinessEventsProducer = await this.getProvider<BusinessEventsProducer>(BusinessEventsProducer);
    await producer.produceBusinessRemovedEvent(this.user, {
      _id: BUSINESS_ID,
      createdAt: new Date().toISOString(),
      name: 'Some business name',
    } as BusinessModel);
  }

  @PactRabbitMqMessageProvider(BusinessRabbitMessagesEnum.BusinessExport)
  public async mockBusinessExport(): Promise<void> {
    const producer: BusinessEventsProducer = await this.getProvider<BusinessEventsProducer>(BusinessEventsProducer);
    await producer.produceBusinessExportEvent(this.business);
  }
}

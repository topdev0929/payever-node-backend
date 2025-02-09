import { Injectable } from '@nestjs/common';
import { AbstractMessageMock, PactRabbitMqMessageProvider } from '@pe/pact-kit';
import { UserRabbitMessagesEnum } from '../../../src/user/enums';
import { UserEventsProducer } from '../../../src/user/producers';
import * as uuid from 'uuid';
import { UserModel, CreateBusinessReportResponseDto } from '../../../src/user';

@Injectable()
export class UserMessagesMock extends AbstractMessageMock {
  private populate = () => {
    return {
      execPopulate: () => {
        return new Promise((resolve) => {
          resolve({});
        });
      },
    };
  };

  private user: UserModel = {
    populate: () => {
      return {
        execPopulate: () => {
          return new Promise((resolve) => {
            resolve({});
          });
        },
      };
    },
    toObject: (): any => {
      return {
        _id: uuid.v4(),
        businesses: [uuid.v4()],
        id: uuid.v4(),
        userAccount: {},
      };
    },
  } as  unknown as UserModel;

  private createBusinessReportResponseDto: CreateBusinessReportResponseDto[] = [
    {
      business: uuid.v4(),
      email: 'hello@world.com',
      firstName: 'Ghimire',
    },
  ];

  @PactRabbitMqMessageProvider(UserRabbitMessagesEnum.UserCreated)
  public async mockUserAccountCreated(): Promise<void> {
    const producer: UserEventsProducer = await this.getProvider<UserEventsProducer>(UserEventsProducer);
    await producer.produceUserCreatedEvent(this.user);
  }

  @PactRabbitMqMessageProvider(UserRabbitMessagesEnum.UserAccountUpdated)
  public async mockUserAccountUpdated(): Promise<void> {
    const producer: UserEventsProducer = await this.getProvider<UserEventsProducer>(UserEventsProducer);
    await producer.produceUserUpdatedEvent(this.user);
  }

  @PactRabbitMqMessageProvider(UserRabbitMessagesEnum.ReportDataPrepared)
  public async mockMailerReportRequestedEvent(): Promise<void> {
    const producer: UserEventsProducer = await this.getProvider<UserEventsProducer>(UserEventsProducer);
    await producer.produceUserReportDataPreparedEvent(this.createBusinessReportResponseDto);
  }

  @PactRabbitMqMessageProvider(UserRabbitMessagesEnum.UserExported)
  public async mockUserExportedEvent(): Promise<void> {
    const producer: UserEventsProducer = await this.getProvider<UserEventsProducer>(UserEventsProducer);
    await producer.produceUserExportEvent(this.user);
  }
}

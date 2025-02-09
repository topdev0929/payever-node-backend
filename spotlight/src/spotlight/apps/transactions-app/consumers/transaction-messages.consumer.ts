import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RabbitChannelsEnum } from '../../../../environments';
import { SpotlightInterface } from '../../../interfaces';
import { SpotlightService } from '../../../services';
import { TransactionRabbitMessagesEnum } from '../enums';
import { TransactionEventDto } from '../dto';
import { AppEnum } from '../../../enums';

@Controller()
export class TransactionMessagesConsumer {
  constructor(
    private readonly spotlightService: SpotlightService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: TransactionRabbitMessagesEnum.TransactionCreated,
  })
  public async onTransactionCreated(data: TransactionEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: TransactionRabbitMessagesEnum.TransactionExport,
  })
  public async onTransactionExport(data: TransactionEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data, false);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: TransactionRabbitMessagesEnum.TransactionRemoved,
  })
  public async onTransactionDeleted(data: TransactionEventDto): Promise<void> {
    await this.spotlightService.delete(
      data.id,
    );
  }

  private async createOrUpdateSpotlightFromEvent(data: TransactionEventDto, index: boolean = true): Promise<void> {
    await this.spotlightService.createOrUpdate(
      this.transactionsToSpotlightDocument(data), 
      data.id,
      index,
    );
  } 

  private transactionsToSpotlightDocument(data: TransactionEventDto): SpotlightInterface {
    return {
      app: AppEnum.Transactions,
      businessId: data.business.id,
      description: data.customer.name,
      icon: data.channel,
      payload: {
        amount: data.amount,
        customer: data.customer?.name,
        reference: data.reference,
      },
      serviceEntityId: data.id,
      title: data.reference,
    };
  }

}

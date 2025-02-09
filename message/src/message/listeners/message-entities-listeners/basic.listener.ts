import { Injectable } from '@nestjs/common';
import { DiscoveryService, DiscoveredClassWithMeta } from '@pe/nest-kit/modules/discovery';
import { ProducerInterface } from '../../producers';
import {
  ChatMessageService,
  ContactsService,
  CommonMessagingService,
  MESSAGING_PRODUCER_TAG,
} from '../../submodules/platform';
import { ChatInviteService } from '../../submodules/invites';
import { EventOriginEnum } from '../../../message/enums';
import { RMQEventsProducer } from '../../producers/rmq-events.producer';
import { UsersService } from '../../../projections/services';
import { MessageChannelSetsService } from '../../services';

@Injectable()
export class BasicListener {
  protected readonly producers: ProducerInterface[] = [];

  constructor(
    protected readonly chatMessageService: ChatMessageService,
    protected readonly commonMessagingService: CommonMessagingService,
    protected readonly contactsService: ContactsService,    
    protected readonly chatInviteService: ChatInviteService,
    protected readonly channelSetService: MessageChannelSetsService,
    protected readonly userService: UsersService,

    protected readonly rabbitEventProducer: RMQEventsProducer,

    private readonly discoveryService: DiscoveryService,
  ) { }

  public async onModuleInit(): Promise<void> {
    const messagingTypes: Array<DiscoveredClassWithMeta<true>> =
      await this.discoveryService.providersWithMetaAtKey(MESSAGING_PRODUCER_TAG);

    for (const item of messagingTypes) {
      this.producers.push(
        item.discoveredClass.instance as ProducerInterface,
      );
    }
  }

  protected async invokeProducers(
    eventSource: EventOriginEnum,
    callback: (producer: ProducerInterface) => Promise<void>,
  ): Promise<void> {
    await Promise.all(this.producers.map((producer: ProducerInterface) => {
      if (producer?.canProduce(eventSource)) {
        return callback(producer);
      }
    }));
  }
}

import { Injectable, Inject } from '@nestjs/common';
import { ProducerInterface } from '../submodules/platform/interfaces/producer.interface';
import { EventDispatcher } from '@pe/nest-kit';
import { FoldersEventsEnum, MappedFolderItemInterface } from '@pe/folders-plugin';
import { EventOriginEnum } from '../enums';
import { AbstractMessagingDocument, MessagingProducer } from '../submodules/platform';
import { messagingToFolderItem } from '../transformers';
import { ChatCreatedExtraDataInterface } from '../interfaces';

/**
 * @todo move to separate module using collector
 */
@MessagingProducer()
@Injectable()
export class FolderPluginEventsProducer implements ProducerInterface {
  @Inject() private readonly eventsDispatcher: EventDispatcher;
  public canProduce(eventSource: EventOriginEnum): boolean {
    return true;
  }

  public async messagesUpdatedWithList(): Promise<void> { }

  public async messagesUpdated(): Promise<void> { }

  public async messagesDeleted(): Promise<void> { }
  
  public async messagesListDeleted(): Promise<void> { }

  public async messagesPosted(): Promise<void> { }

  public async chatCreated(
    chat: AbstractMessagingDocument,
    data: ChatCreatedExtraDataInterface<AbstractMessagingDocument>,
  ): Promise<void> {
    if (!data) {
      return;
    }
    const eventData: MappedFolderItemInterface = {
      ...messagingToFolderItem(chat),
      parentFolderId: data.prototype.parentFolderId,
    };
    await this.eventsDispatcher.dispatch(
      FoldersEventsEnum.FolderActionCreateDocument,
      eventData,
    );
  }

  public async chatUpdated(chat: AbstractMessagingDocument): Promise<void> {
    await this.eventsDispatcher.dispatch(
      FoldersEventsEnum.FolderActionUpdateDocument,
      messagingToFolderItem(chat),
    );
  }

  public async chatDeleted(): Promise<void> { }

  public async chatMessagePinned(): Promise<void> { }

  public async chatMessageUnpinned(): Promise<void> { }

  public async memberIncluded(): Promise<void> { }

  public async memberChanged(): Promise<void> { }

  public async memberExcluded(): Promise<void> { }

  public async memberLeft(): Promise<void> { }

  public async contactCreated(): Promise<void> { }

  public async contactUpdated(): Promise<void> { }

  public async contactStatus(): Promise<void> { }

  public async typingUpdated(): Promise<void> { }

  public async onlineMembersUpdated(): Promise<void> { }
}

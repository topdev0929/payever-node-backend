import { debounce, DebouncedFunc, DebounceSettings } from 'lodash';
import { Injectable } from '@nestjs/common';
import {
  ProducerInterface,
  AbstractMessagingDocument,
  ContactDocument,
  AbstractChatMessageDocument,
  MessagingProducer,
  CommonMessagingService,
  DecryptedAbstractChatMessageInterface,
  Pinned,
} from '../../platform';
import { MessageElasticService } from '../services';
import { environment } from '../../../../environments';
import { ChatOnlineMemberInterface } from '../../../schemas';

const debouceOptions: DebounceSettings = {
  maxWait: environment.debounceEvents.maxWait,
};

interface QueueItem {
  chat: AbstractMessagingDocument;
  messages: AbstractChatMessageDocument[];
}

@MessagingProducer()
@Injectable()
export class ElasticIndexProducer implements ProducerInterface {
  private messageBatchesToSave: QueueItem[] = [];
  private flushMessagesToSaveDebounceFn: DebouncedFunc<() => Promise<void>> = debounce(
    async () => this.flushMessagesToSave(),
    environment.debounceEvents.wait,
    debouceOptions,
  );
  private messagesToDelete: AbstractChatMessageDocument[] = [];
  private flushMessagesToDeleteDebounceFn: DebouncedFunc<() => Promise<void>> = debounce(
    async () => this.flushMessagesToDelete(),
    environment.debounceEvents.wait,
    debouceOptions,
  );

  constructor(
    private readonly messageElasticService: MessageElasticService,
    private readonly commonMessagingService: CommonMessagingService,
  ) { }

  public canProduce(): boolean {
    return true;
  }

  public async messagesUpdatedWithList(): Promise<void> { }

  public async contactCreated(contact: ContactDocument): Promise<void> { }

  public async contactUpdated(contact: ContactDocument): Promise<void> { }

  public async contactStatus(): Promise<void> { }

  public async memberIncluded(): Promise<void> { }

  public async memberChanged(): Promise<void> { }

  public async memberExcluded(): Promise<void> { }

  public async memberLeft(): Promise<void> { }

  public async chatCreated(message: AbstractMessagingDocument): Promise<void> { }

  public async chatUpdated(message: AbstractMessagingDocument): Promise<void> { }

  public async chatDeleted(message: AbstractMessagingDocument): Promise<void> { }

  public async chatMessagePinned(chat: AbstractMessagingDocument, pinned: Pinned): Promise<void> { }

  public async chatMessageUnpinned(chat: AbstractMessagingDocument, pinned: Pinned): Promise<void> { }

  public async messagesUpdated(
    messages: AbstractChatMessageDocument[],
    chat: AbstractMessagingDocument,
  ): Promise<void> {
    this.messageBatchesToSave.push({ chat, messages });
    await this.flushMessagesToSaveDebounceFn();
  }

  public async messagesDeleted(
    messages: AbstractChatMessageDocument[],
    chat: AbstractMessagingDocument,
  ): Promise<void> {
    this.messagesToDelete.push(...messages);
    await this.flushMessagesToDeleteDebounceFn();
  }

  public async messagesListDeleted(): Promise<void> { }

  public async messagesPosted(
    messages: AbstractChatMessageDocument[],
    chat: AbstractMessagingDocument,
  ): Promise<void> {
    this.messageBatchesToSave.push({ chat, messages });
    await this.flushMessagesToSaveDebounceFn();
  }

  public async typingUpdated(
    chat: AbstractMessagingDocument,
    member: ChatOnlineMemberInterface,
    isTyping: boolean,
    typingMembers: ChatOnlineMemberInterface[],
  ): Promise<void> { }

  public async onlineMembersUpdated(
    chat: AbstractMessagingDocument,
    onlineMembers: ChatOnlineMemberInterface[],
    onlineMembersCount: number,
  ): Promise<void> { }

  private async flushMessagesToSave(): Promise<void> {
    const batchesToSave: QueueItem[] = [...this.messageBatchesToSave];
    this.messageBatchesToSave.length = 0;

    const resortedBatch: Map<AbstractMessagingDocument, AbstractChatMessageDocument[]> = new Map();
    for (const batchItem of batchesToSave) {
      if (!resortedBatch.has(batchItem.chat)) {
        resortedBatch.set(batchItem.chat, []);
      }
      resortedBatch.get(batchItem.chat).push(...batchItem.messages);
    }

    const messagesToIndex: DecryptedAbstractChatMessageInterface[] = [];
    for (const [chat, messages] of resortedBatch.entries()) {
      messagesToIndex.push(
        ...(
          await this.commonMessagingService.decryptMessagesWithSalt(
            messages,
            chat.salt,
          )
        ),
      );
    }

    await this.messageElasticService.saveIndex(messagesToIndex);
  }

  private async flushMessagesToDelete(): Promise<void> {
    const messagesToFlush: AbstractChatMessageDocument[] = [...this.messagesToDelete];
    this.messagesToDelete.length = 0;
    await this.messageElasticService.deleteIndex(messagesToFlush);
  }
}

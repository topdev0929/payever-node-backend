import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateWriteOpResult } from 'mongoose';
import { AbstractChatMessageDocument, AbstractChatMessage, AbstractMessagingDocument } from '../schemas';
import { CommonMessagingService, MessagesRedisService } from '.';
import { MessageModelDbOperationDto } from '../../../dto/message-db-writer';


@Injectable()
export class MessagesDbWriterService {
  constructor(
    @InjectModel(AbstractChatMessage.name)
    private readonly chatMessageModel: Model<AbstractChatMessageDocument>,
    @Inject(forwardRef(() => MessagesRedisService)) private messageRedisService: MessagesRedisService,
    private readonly commonMessagingService: CommonMessagingService,
  ) {
  }

  public async performDbOperation(dto: MessageModelDbOperationDto): Promise<void> {
    switch (dto.operation) {
      case 'create':
        await this.create(dto);
        break;
      case 'update-one':
        await this.updateOne(dto);
        break;
      case 'update-many':
        await this.updateMany(dto);
        break;
      default:
        throw new Error(`db operation '${dto.operation}' not defined.`);
    }
  }

  private async create(
    dto: MessageModelDbOperationDto,
  ): Promise<void> {
    try {
      const message: AbstractChatMessageDocument = await this.chatMessageModel.create(dto.createModel);

      const exist: AbstractMessagingDocument | null = message.template ? await this.commonMessagingService.findOne({
        _id: message.chat,
        'lastMessages.template': message.template,
      }) : null;

      if (!exist) {
        await this.commonMessagingService.addLastMessage(message);
      }

    } catch (ex) {
      if (ex.code === 11000) { // Duplicate key
        const $set: any = { ...dto.createModel };
        delete $set.createdAt;
        delete $set.updatedAt;
        await this.chatMessageModel.updateOne(
          { _id: dto.createModel._id },
          { $set },
        );
      } else {
        throw ex;
      }
    }
    await this.messageRedisService.onDbOperationPerformed(dto);
  }

  private async updateOne(
    dto: MessageModelDbOperationDto,
  ): Promise<void> {
    const message: AbstractChatMessageDocument = await this.chatMessageModel.findOneAndUpdate(
      dto.filter,
      dto.updateQuery,
      { new: true },
    );

    if (message) {
      await this.commonMessagingService.replaceLastMessage(message);
    }

    await this.messageRedisService.onDbOperationPerformed(dto);
  }

  private async updateMany(
    dto: MessageModelDbOperationDto,
  ): Promise<void> {
    const updateResult: UpdateWriteOpResult = await this.chatMessageModel.updateMany(
      dto.filter,
      dto.updateQuery,
    );

    if (updateResult.nModified === 0) {
      return;
    }

    const messages: AbstractChatMessageDocument[] = await this.chatMessageModel.find(dto.filter).lean();
    await Promise.all(messages.map((message: AbstractChatMessageDocument) => {
      return this.commonMessagingService.replaceLastMessage(message);
    }));
    await Promise.all(messages.map((message: AbstractChatMessageDocument) => {
      return this.messageRedisService.onDbOperationPerformed({
        filter: { _id: message._id, type: message.type },
        operation: 'update-one',
      });
    }));
  }
}

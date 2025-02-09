import { ChatMessageType } from '@pe/message-kit';
import { DocumentDefinition, UpdateQuery } from 'mongoose';
import { AbstractChatMessageDocument } from '../../submodules/platform/schemas';

export class MessageModelDbOperationDto {
  public operation: 'create' | 'update-one' | 'update-many';
  public filter?: { _id?: string; type: ChatMessageType; replyTo?: string };
  public updateQuery?: UpdateQuery<AbstractChatMessageDocument>;
  public createModel?: DocumentDefinition<AbstractChatMessageDocument>;
}

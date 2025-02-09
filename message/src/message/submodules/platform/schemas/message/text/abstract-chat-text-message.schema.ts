import { Schema as SchemaDecorator, Prop } from '@nestjs/mongoose';
import { AbstractChatMessage } from '../abstract-chat-message.schema';
import { ChatMessageAttachmentSchema, ChatMessageAttachment } from './chat-text-message-attachment.schema';
import { ForwardFrom, ForwardFromSchema } from './forward-from.schema';

@SchemaDecorator({
  collection: 'chatmessages',
  discriminatorKey: 'type',
  timestamps: true,
})
export class AbstractChatTextMessage extends AbstractChatMessage {
  public readonly type: 'text';

  @Prop({
    required: false,
    type: [ChatMessageAttachmentSchema],
  })
  public attachments: ChatMessageAttachment[];

  @Prop({
    required: true,
  })
  public content: string;

  @Prop()
  public contentType?: string;

  @Prop()
  public contentPayload?: string;

  @Prop({
    type: ForwardFromSchema,
  })
  public forwardFrom?: ForwardFrom;

  @Prop()
  public replyTo?: string;

  @Prop()
  public replyToContent?: string;

  @Prop({
    index: true,
    required: false,
  })
  public sender?: string;
}

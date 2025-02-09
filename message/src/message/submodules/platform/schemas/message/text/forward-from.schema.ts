import { Schema, Types } from 'mongoose';

import { SchemaFactory, Schema as SchemaDecorator, Prop } from '@nestjs/mongoose';
import { ChatMessageForwardFromInterface } from '@pe/message-kit';

@SchemaDecorator({
  _id: false,
  id: false,
})
export class ForwardFrom implements ChatMessageForwardFromInterface {
  @Prop()
  public _id: string;

  @Prop()
  public sender?: string;

  @Prop()
  public senderTitle?: string;

  @Prop()
  public messaging?: string;

  @Prop()
  public messagingTitle?: string;
}


export interface ForwardFromEmbeddedDocument extends ForwardFrom, Types.EmbeddedDocument {
  _id: string;
}

export const ForwardFromSchema: Schema<ForwardFromEmbeddedDocument> = SchemaFactory.createForClass(ForwardFrom);

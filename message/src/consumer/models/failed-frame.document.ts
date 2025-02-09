import { Document } from 'mongoose';
import { IMessage } from '@stomp/stompjs';

export interface FailedFrameDocument extends Document {
  _id: string;
  err: any;
  message: IMessage;
}

import { Socket } from 'socket.io';
import { DecodedUserTokenInterface } from './decoded-token.interface';

export interface SocketWithToken extends Socket {
  decodedToken: DecodedUserTokenInterface;
}

export interface LiveChatSocket extends Socket {
  contactId: string;
}

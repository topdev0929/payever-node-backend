import { Socket } from 'socket.io';
import { DecodedUserTokenInterface } from './decoded-token.interface';

export interface SocketWithToken extends Socket {
  businessId: string;

  decodedToken: DecodedUserTokenInterface;

  token: string;
}

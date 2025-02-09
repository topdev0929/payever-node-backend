import * as http from 'http';

export interface RawRequestInterface extends http.IncomingMessage {
  body: any;
}

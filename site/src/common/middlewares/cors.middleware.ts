import { Injectable, NestMiddleware } from '@nestjs/common';
import { IncomingMessage, ServerResponse } from 'http';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  public use(
    incomingMessage: IncomingMessage,
    response: ServerResponse,
    next: () => void,
  ): void {
    const origin: string =
      (incomingMessage.headers.origin) ||
      `http://${incomingMessage.headers.host}`;

    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Access-Control-Allow-Headers', 'content-type');
    response.setHeader(
      'Access-Control-Allow-Methods',
      'POST, OPTIONS, GET, PUT, PATCH',
    );
    response.setHeader('Access-Control-Allow-Credentials', 'true');

    next();
  }
}

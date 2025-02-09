import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NestInterceptor, CallHandler, ExecutionContext } from '@nestjs/common';
import {
  WsResponse,
} from '@nestjs/websockets';

import {
  MessageResponseInterface,
} from '../interfaces';

export class MessageResponseToWsResponseInterceptor implements NestInterceptor {
  public intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    return next
      .handle()
      .pipe(
        map((result?: MessageResponseInterface) => {
          if (result && 'name' in result && 'result' in result) {
            return {
              data: result,
              event: result.name,
            } as WsResponse;
          }

          return result;
        }),
      );
  }
}

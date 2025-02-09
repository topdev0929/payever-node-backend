import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { IncomingHttpHeaders, IncomingMessage } from 'http';
import * as multiparty from 'multiparty';

@Injectable()
export class MultipartPaymentMiddleware
  implements NestMiddleware<IncomingMessage & { body: any }, FastifyReply<any>> {
  public use(req: IncomingMessage & { body: any }, res: FastifyReply<any>, next: () => void): void {
    const regExpContentType: RegExp = /^multipart\/(?:form-data|related)(?:;|$)/i;
    const contentType: string = this.retrieveAndFixContentType(req);

    if (!regExpContentType.test(contentType)) {
      next();

      return;
    }

    const form: multiparty.Form = new multiparty.Form();

    form.parse(req, (err: Error, fields: { [prop: string]: any }) => {
      if (fields) {
        const dto: { } = { };
        for (const prop in fields) {
          if (fields.hasOwnProperty(prop)) {
            let preparedValue: any = { };
            try {
              preparedValue = this.prepareValue(prop, fields[prop].pop());
            } catch (e) {
            }

            dto[prop] = preparedValue;
          }
        }

        req.body = dto;
      }

      next();
    });
  }

  private prepareValue(prop: string, value: any): any {
    if (prop === 'extra' && typeof value === 'string') {
      return JSON.parse(value);
    }

    if (prop === 'cart' && typeof value === 'string') {
      return JSON.parse(value);
    }

    return value;
  }

  private retrieveAndFixContentType(req: IncomingMessage & { body: any }): string {
    const headers: IncomingHttpHeaders = req.headers;
    let contentType: string = headers['content-type'];
    if (!contentType) {
      contentType = 'multipart/form-data';
      req.headers['content-type'] = contentType;
    }

    return contentType;
  }
}

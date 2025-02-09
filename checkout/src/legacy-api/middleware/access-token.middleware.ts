import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

@Injectable()
export class AccessTokenMiddleware implements NestMiddleware {
  public use(req: FastifyRequest<any>, res: FastifyReply<any>, next: () => void): void {
    req.body && this.extract(req.body, req);

    next();
  }

  private extract(obj: { access_token: string }, req: FastifyRequest<any>): void {
    if (obj.hasOwnProperty('access_token')) {
      req.headers.authorization = `Bearer ${obj.access_token}`;
      delete obj.access_token;
    }
  }
}

import { FastifyRequest } from 'fastify';
import { ActionWrapperDto } from '../dto';

export class RequestDataHelper {
  public static getIdempotencyKey(req: FastifyRequest<any>): string {
    return req?.headers?.['idempotency-key'];
  }

  public static getForceRetryKey(req: FastifyRequest<any>): string {
    return req?.headers?.['x-payever-force-retry'];
  }

  public static prepareHeadersFromWrapper(
    actionWrapper: ActionWrapperDto,
  ): object {
    let headers: { } = { };

    if (actionWrapper.idempotencyKey) {
      headers = {
        ...headers,
        'idempotency-key': actionWrapper.idempotencyKey,
      };
    }

    if (actionWrapper.forceRetryKey) {
      headers = {
        ...headers,
        'x-payever-force-retry': actionWrapper.forceRetryKey,
      };
    }

    return headers;
  }
}

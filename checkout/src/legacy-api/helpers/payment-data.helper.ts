import { FastifyRequest } from 'fastify';
import { CreatePaymentDto } from '../dto/request/common';
import { HeadersHolderDto } from '../dto';

export class PaymentDataHelper {
  public static extractBusinessIdFromPaymentDto(requestDto: CreatePaymentDto): string {
    return requestDto.extra && requestDto.extra.business_id
      ? requestDto.extra.business_id
      : null;
  }

  public static getUserAgent(req: FastifyRequest<any>): string {
    return req?.headers?.['user-agent'];
  }

  public static getIdempotencyKey(req: FastifyRequest<any>): string {
    return req?.headers?.['idempotency-key'];
  }

  public static getForceRetryKey(req: FastifyRequest<any>): string {
    return req?.headers?.['x-payever-force-retry'];
  }

  public static extractJwtTokenFromRequest(request: FastifyRequest<any>): string {
    if (request?.headers
      && request.headers?.authorization
      && request.headers.authorization?.split(' ')[0] === 'Bearer'
    ) {
      return request.headers.authorization.split(' ')[1];
    }

    if (request?.query && request.query?.access_token) {
      return request.query.access_token;
    }

    if (request?.body && request.body?.access_token) {
      return request.body.access_token;
    }

    return null;
  }

  public static prepareHeadersHolderFromRequest(
    req: FastifyRequest<any>,
  ): HeadersHolderDto {
    const userAgent: string = PaymentDataHelper.getUserAgent(req);
    const idempotencyKey: string = PaymentDataHelper.getIdempotencyKey(req);
    const forceRetryKey: string = PaymentDataHelper.getForceRetryKey(req);
    const token: string = PaymentDataHelper.extractJwtTokenFromRequest(req);

    const headersHolder: HeadersHolderDto = new HeadersHolderDto();
    headersHolder.token = token;
    headersHolder.userAgent = userAgent;
    headersHolder.idempotencyKey = idempotencyKey;
    headersHolder.forceRetryKey = forceRetryKey;

    return headersHolder;
  }

  public static prepareHeadersFromHolder(
    headersHolder: HeadersHolderDto,
    isIntercom: boolean,
  ): object {
    let headers: { } = { };

    if (!isIntercom && headersHolder.token) {
      headers = {
        ...headers,
        'authorization': `Bearer ${headersHolder.token}`,
      };
    }

    if (headersHolder.userAgent) {
      headers = {
        ...headers,
        'user-agent': headersHolder.userAgent,
      };
    }

    if (headersHolder.idempotencyKey) {
      headers = {
        ...headers,
        'idempotency-key': headersHolder.idempotencyKey,
      };
    }

    if (headersHolder.forceRetryKey) {
      headers = {
        ...headers,
        'x-payever-force-retry': headersHolder.forceRetryKey,
      };
    }

    return headers;
  }
}

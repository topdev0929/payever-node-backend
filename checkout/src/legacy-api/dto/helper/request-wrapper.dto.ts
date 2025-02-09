import { FastifyRequest } from 'fastify';
import { AccessTokenPayload } from '@pe/nest-kit';

export class RequestWrapperDto {
  public request: FastifyRequest<any>;
  public user: AccessTokenPayload;
  public targetBusinessId?: string;
}

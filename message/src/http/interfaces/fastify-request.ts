import { FastifyRequest } from 'fastify';

export type FastifyRequestLocal = FastifyRequest<{
  Querystring: {
    limit: string;
    page?: string;
    filter: string;
  };
}>;

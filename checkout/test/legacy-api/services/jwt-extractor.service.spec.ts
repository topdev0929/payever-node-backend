import { DefaultBody, DefaultHeaders, DefaultQuery, FastifyRequest } from 'fastify';
import 'mocha';
import * as sinon from 'sinon';
import { IncomingMessage } from 'src/http';
import { chaiExpect } from '../../common/chai-helpers';
import { JwtExtractorService } from './jwt-extractor.service';

const expect = chaiExpect;

describe('JwtExtractorService', () => {
  let sandbox;

  beforeEach(async () => {
    sandbox = await sinon.createSandbox();
  });

  afterEach(async () => {
    await sandbox.restore();
    sandbox = undefined;
  });

  describe('Extract jwt token from request', () => {
    context('Extract access_token param from request headers', () => {
      it('should return access_token param from request headers', () => {
        const request = {
          headers: {
            authorization: 'Bearer jwt_token_12345',
          } as DefaultHeaders,
        } as FastifyRequest<IncomingMessage>;

        expect(
          JwtExtractorService.extractJwtTokenFromRequest(request),
        ).to.equal('jwt_token_12345');
      });
    });

    context('Extract access_token param from request query', () => {
      it('should return access_token param from request query', () => {
        const request = {
          query: {
            access_token: 'jwt_token_12345',
          } as DefaultQuery,
        } as FastifyRequest<IncomingMessage>;

        expect(
          JwtExtractorService.extractJwtTokenFromRequest(request),
        ).to.equal('jwt_token_12345');
      });
    });

    context('Extract access_token param from request body', () => {
      it('should return access_token param from request body', () => {
        const request = {
          body: {
            access_token: 'jwt_token_12345',
          } as DefaultBody,
        } as FastifyRequest<IncomingMessage>;

        expect(
          JwtExtractorService.extractJwtTokenFromRequest(request),
        ).to.equal('jwt_token_12345');
      });
    });

    context('Request without jwt token', () => {
      it('should return jwt token as null', () => {
        const request = {} as FastifyRequest<IncomingMessage>;

        expect(
          JwtExtractorService.extractJwtTokenFromRequest(request),
        ).to.null;
      });
    });
  });
});

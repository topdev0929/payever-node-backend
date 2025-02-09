import 'mocha';
import * as sinon from 'sinon';
import * as mongoose from 'mongoose';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { chaiExpect } from '../../bootstrap';
import { ClientModel } from '../../../src/payment-notifications/models';
import { ClientSchema, ClientSchemaName } from '../../../src/payment-notifications/schemas';
import { ClientService, OAuthService } from '../../../src/payment-notifications/services';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { IntercomService } from '@pe/nest-kit';
import { ClientDto, ClientSecretResponseDto } from '../../../src/payment-notifications/dto';

const expect: Chai.ExpectStatic = chaiExpect;

/* tslint:disable-next-line */
describe('OauthService', () => {
  let sandbox: sinon.SinonSandbox;
  let clientService: ClientService;
  let oauthService: OAuthService;
  let intercomService: IntercomService;
  let logger: Logger;

  const Client: any = mongoose.model(
    ClientSchemaName,
    ClientSchema,
  );

  before(async () => {
    const testAppModule: TestingModule = await Test.createTestingModule({
      providers: [
        OAuthService,
        {
          provide: 'ClientService',
          useValue: {
            create: async (args: any): Promise<any> => { },
            findByClientId: async (args: any): Promise<any> => { },
          },
        },
        {
          provide: 'IntercomService',
          useValue: {
            get: async (args: any): Promise<any> => { },
          },
        },
        {
          provide: 'Logger',
          useValue: {
            error: async (args: any): Promise<any> => { },
            log: async (args: any): Promise<any> => { },
          },
        },
      ],
    }).compile();

    oauthService = testAppModule.get<OAuthService>(OAuthService);
    clientService = testAppModule.get<ClientService>(ClientService);
    intercomService = testAppModule.get<IntercomService>(IntercomService);
    logger = testAppModule.get<Logger>(Logger);
  });

  beforeEach(async () => {
    sandbox = await sinon.createSandbox();
  });

  afterEach(async () => {
    await sandbox.restore();
    sandbox = undefined;
  });

  describe('getOAuthClientSecret', () => {
    it('should return client secret dto, auth micro call', async () => {
      const httpResult: AxiosResponse = {
        config: { },
        data: {
          /* tslint:disable-next-line */
          secret: 'client-secret',
        },
        headers: { },
        status: 200,
        statusText: 'OK',
      };

      sandbox.stub(intercomService, 'get').callsFake(async (url: any, config: any) => {
        expect(url).to.match(/\/oauth\/business-id\/clients\/client-id/);

        return of(httpResult);
      });

      const clientDto: ClientDto = {
        id: 'client-id',
        secret: 'client-secret',
      };

      sandbox.stub(clientService, 'create').callsFake(async (client: any) => {
        expect(client).to.matchPattern(clientDto);

        return { } as ClientModel;
      });

      const result: any = await oauthService.getOAuthClientSecret('client-id', 'business-id');

      expect(result).to.matchPattern({ secret: 'client-secret' });
    });

    it('should return null, client secret not found', async () => {
      const httpResult: AxiosResponse = {
        config: { },
        data: { },
        headers: { },
        status: 400,
        statusText: 'OK',
      };

      sandbox.stub(intercomService, 'get').callsFake(async (url: any, config: any) => {
        expect(url).to.match(/\/oauth\/business-id\/clients\/client-id/);

        return of(httpResult);
      });

      const result: ClientSecretResponseDto = await oauthService.getOAuthClientSecret('client-id', 'business-id');

      expect(result.secret).to.undefined;
    });
  });

  it('should return client secret dto, client secret found by client id in DB', async () => {
    const clientModel: ClientModel = new Client({
      _id: 'client-id',
      secret: 'client-secret',
    });

    sandbox.stub(clientService, 'findByClientId').callsFake(async (clientId: any) => {
      expect(clientId).to.eq('client-id');

      return clientModel;
    });

    const result: any = await oauthService.getOAuthClientSecret('client-id', 'business-id');

    expect(result).to.matchPattern({ secret: 'client-secret' });
  });
});

import 'mocha';

import { Logger } from '@nestjs/common';
import { RabbitMqClient, RabbitMqRPCClient } from '@pe/nest-kit';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { Types } from 'mongoose';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as uuid from 'uuid';

import { AppsEventsProducer } from '../../../../src/apps/producers/apps-events.producer';
import { AppRegistryEventNameEnum, CommerceosEventNameEnum } from '../../../../src/environments/rabbitmq.enum';
import { BusinessModel } from '../../../../src/models/business.model';
import { InstalledApp } from '../../../../src/models/interfaces/installed-app';
import { UuidDocument } from '../../../../src/models/interfaces/uuid-document';
import { OriginAppService } from '../../../../src/services/origin-app.service';
import { BusinessService } from '../../../../src/business/services';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('test AppsEventsProducer', () => {
  let sandbox: sinon.SinonSandbox;
  let testService: AppsEventsProducer;
  let rabbitClient: RabbitMqClient;
  let rabbitRPCClient: RabbitMqRPCClient;
  let originAppService: OriginAppService;
  let businessService: BusinessService;
  let logger: Logger;

  const installedAppInstance: InstalledApp = {
    _id: uuid.v4(),
    app: '11111111-1111-1111-1111-111111111111',
    code: 'coupons',
    installed: false,
    setupStatus: 'notStarted',
    setupStep: 'test',
    statusChangedAt: new Date(),
    subscription: {} as any,
  } as InstalledApp;

  const businessModelInstance: BusinessModel = {
    _id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    installedApps: [installedAppInstance] as Types.DocumentArray<InstalledApp & UuidDocument>,
    save: (): any => {},
    populate(): any {
      return this;
    },
    execPopulate(): any {
      return this;
    },
  } as any;

  before(() => {
    rabbitClient = {
      send: (): any => {},
    } as any;
    rabbitRPCClient = {
      send: (): any => {},
    } as any;
    logger = {
      send: (): any => {},
    } as any;

    originAppService = {
      isAppAvailableForOrigin: (): any => {},
      findAppIdsByOrigin: (): any => {},
      findAppIdsByBusiness: (): any => {},
    } as any;

    businessService = {
      findOneById: (): any => { },
      getOrCreate: (): BusinessModel => null,
    } as any;

    testService = new AppsEventsProducer(rabbitClient, rabbitRPCClient, originAppService, businessService, logger);
  });
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    sandbox = undefined;
  });

  describe('test produceAppInstalledEvent', () => {
    it(`should produce ${AppRegistryEventNameEnum.ApplicationInstalled} event`, async () => {
      sandbox.stub(rabbitClient, 'send').resolves(null);

      console.log(rabbitClient.send)

      await testService.produceAppInstalledEvent(installedAppInstance, businessModelInstance);
      expect(rabbitClient.send).to.have.been.calledWithMatch(
          { channel: AppRegistryEventNameEnum.ApplicationInstalled, exchange: "async_events" },
      );

      expect(rabbitClient.send).to.have.been.calledWithMatch(
        { channel: CommerceosEventNameEnum.ApplicationInstalled, exchange: "async_events" },
    );
    });
  });

  describe('test produceAppInstalledEvent', () => {
    it(`should produce ${AppRegistryEventNameEnum.ApplicationUnInstalled} event`, async () => {
      sandbox.stub(rabbitClient, 'send').resolves(null);

      await testService.produceAppUninstalledEvent(installedAppInstance, businessModelInstance);
      expect(rabbitClient.send).to.have.been.calledWithMatch(
        { channel: AppRegistryEventNameEnum.ApplicationUnInstalled, exchange: "async_events" },
      );

      expect(rabbitClient.send).to.have.been.calledWithMatch(
        { channel: CommerceosEventNameEnum.ApplicationUninstalled, exchange: "async_events" },
      );
    });
  });
});

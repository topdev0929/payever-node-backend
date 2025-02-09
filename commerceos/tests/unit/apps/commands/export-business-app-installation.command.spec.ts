import 'mocha';

import { Logger } from '@nestjs/common';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { Types } from 'mongoose';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as uuid from 'uuid';
import { Query, QueryCursor } from 'mongoose';

import { ExportBusinessAppInstallationsCommand } from '../../../../src/apps/commands/export-business-app-installations.command';
import { AppsEventsProducer } from '../../../../src/apps/producers';
import { BusinessAppsService } from '../../../../src/apps/services/business.apps.service';
import { BusinessModel } from '../../../../src/models/business.model';
import { InstalledApp } from '../../../../src/models/interfaces/installed-app';
import { UuidDocument } from '../../../../src/models/interfaces/uuid-document';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('test ExportBusinessAppInstallationsCommand', () => {
  let sandbox: sinon.SinonSandbox;
  let testService: ExportBusinessAppInstallationsCommand;
  let logger: Logger;
  let businessAppsService: BusinessAppsService;
  let producer: AppsEventsProducer;

  const businessModelInstance: BusinessModel = {
    _id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    installedApps: [
      {
        _id: uuid.v4(),
        app: '11111111-1111-1111-1111-111111111111',
        code: 'coupons',
        installed: false,
        setupStatus: 'notStarted',
        setupStep: 'test',
        statusChangedAt: new Date(),
        subscription: {} as any,
      } as InstalledApp,
      {
        _id: uuid.v4(),
        app: '11111111-1111-1111-1111-111111111111',
        code: 'coupons',
        installed: true,
        setupStatus: 'notStarted',
        setupStep: 'test',
        statusChangedAt: new Date(),
        subscription: {} as any,
      } as InstalledApp,
    ] as Types.DocumentArray<InstalledApp & UuidDocument>,
    save: (): any => {},
    populate(): any {
      return this;
    },
    execPopulate(): any {
      return this;
    },
  } as any;

  before(() => {
    businessAppsService = {
      findAll: (): any => {},
    } as any;

    producer = {
      produceAppInstalledEvent: (): any => {},
    } as any;

    logger = {
      log: (): any => {},
    } as any;

    testService = new ExportBusinessAppInstallationsCommand(logger, businessAppsService, producer);
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    sandbox = undefined;
  });

  describe('test run()', () => {
    it('should run business export command', async () => {
      sandbox.stub(logger, 'log').returns(null);
      sandbox.stub(producer, 'produceAppInstalledEvent');
      sandbox
        .stub(businessAppsService, 'findAll')
        .onFirstCall()
        .returns(
          { cursor: sinon.stub().withArgs({ batchSize: 250 }).returns([businessModelInstance]) } as any,
        )
        .onSecondCall()
        .returns(
          { cursor: sinon.stub().withArgs({ batchSize: 250 }).returns([]) } as any,
        );
      await testService.run();
      expect(producer.produceAppInstalledEvent).calledOnce;
    });
  });
});

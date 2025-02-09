import 'mocha';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { Types } from 'mongoose';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as uuid from 'uuid';

import { BusinessModel } from '../../../../src/models/business.model';
import { InstalledApp } from '../../../../src/models/interfaces/installed-app';
import { UuidDocument } from '../../../../src/models/interfaces/uuid-document';
import { SectionsEnum } from '../../../../src/stepper/enums';
import { BusinessEventsListener } from '../../../../src/stepper/event-listeners/business-events.listener';
import { DefaultStepModel } from '../../../../src/stepper/models';
import { BusinessStepService, DefaultStepService } from '../../../../src/stepper/services';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('BusinessEventsListener', () => {
  let sandbox: sinon.SinonSandbox;
  let businessStepService: BusinessStepService;
  let defaultStepService: DefaultStepService;
  let testService: BusinessEventsListener;

  const businessModelInstance: BusinessModel = {
    _id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    installedApps: [
      {
        _id: uuid.v4(),
        app: '11111111-1111-1111-1111-111111111111',
        code: 'coupons',
        installed: false,
        setupStatus: 'notStarted',
        statusChangedAt: new Date(),
        setupStep: 'test',
        subscription: {} as any,
      } as InstalledApp,
    ] as Types.DocumentArray<InstalledApp & UuidDocument>,
  } as any;

  const defaultStepModelInstance: DefaultStepModel = {
    action: 'chooseTheme',
    allowSkip: true,
    order: 2,
    section: SectionsEnum.Shop,
    title: 'some title',
  } as any;

  before(() => {
    defaultStepService = {
      getListForSection: (): any => {},
    } as any;

    businessStepService = {
      createStepsForBusiness: (): any => {},
      deleteStepsForBusiness: (): any => {},
    } as any;

    testService = new BusinessEventsListener(defaultStepService, businessStepService);
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    sandbox = undefined;
  });

  describe('onBusinessCreated()', () => {
    it('should create steps for business', async () => {
      sandbox.stub(businessStepService, 'createStepsForBusiness');
      sandbox.stub(defaultStepService, 'getListForSection').resolves([defaultStepModelInstance]);
      await testService.onBusinessCreated(businessModelInstance);
      expect(businessStepService.createStepsForBusiness).calledOnce;
    });
  });

  describe('onBusinessRemoved()', () => {
    it('should delete business step model instance', async () => {
      sandbox.stub(businessStepService, 'deleteStepsForBusiness');
      await testService.onBusinessRemoved(businessModelInstance);
      expect(businessStepService.deleteStepsForBusiness).calledOnceWithExactly(businessModelInstance);
    });
  });
});

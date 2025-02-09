import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import 'mocha';
import { Model, Types } from 'mongoose';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import { IntercomService } from '@pe/nest-kit';
import { OnboardingDto } from '../../../../src/onboarding/dto';
import { OnboardingTypeEnum } from '../../../../src/onboarding/enums';
import { ActionModel, OnboardingModel } from '../../../../src/onboarding/models';
import { CacheManager } from '../../../../src/onboarding/services';
import { OnboardingManager } from '../../../../src/onboarding/services/onboarding.manager';
import { OriginAppService } from '../../../../src/services/origin-app.service';
import { Logger } from '@nestjs/common';

chai.use(sinonChai);
chai.use(chaiAsPromised);

const expect: Chai.ExpectStatic = chai.expect;

describe('OnboardingManager', () => {
  let sandbox: sinon.SinonSandbox;
  let onboardingModel: Model<OnboardingModel>;
  let testService: OnboardingManager;
  let originAppsService: OriginAppService;
  let logger: Logger;

  const onboardingModelInstance: OnboardingModel = {
    'accountFlags': { },
    'afterLogin': [] as Types.DocumentArray<ActionModel>,
    'afterRegistration': [] as Types.DocumentArray<ActionModel>,
    'defaultLoginByEmail': true,
    'logo': '#icon-industries-test-whiteboard',
    'name': 'test Tasty Plastic Keyboard',
    'type': 'partner' as OnboardingTypeEnum,
    'wallpaperUrl': 'https://cdn.test.devpayever.com/images/industry-background-implement.jpg',
  } as OnboardingModel;

  before(() => {
    onboardingModel = {
      countDocuments: (): any => { },
      create: (): any => { },
      delete: (): any => { },
      find: (): any => { },
      findOne: (): any => { },
      findOneAndUpdate: (): any => { },
    } as any;

    logger = {
      warn: (): any => {},
    } as any;

    originAppsService = {
      isAppAvailableForOrigin: (): any => {},
      findAppIdsByOrigin: (): any => {},
      findAppIdsByBusiness: (): any => {},
    } as any;


    const cacheManager: CacheManager = { 
      getData: (): any => { },
      setData: (): any => { },
    } as any;
    const httpService: IntercomService = { } as any;

    testService = new OnboardingManager(
      onboardingModel,
      cacheManager,
      httpService,
      originAppsService,
      logger
    );
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    sandbox = undefined;
  });

  describe('test CRUD for onboardings', () => {
    it('should return a list of onboardingModel instances', async () => {
      sandbox.stub(onboardingModel, 'find').resolves([onboardingModelInstance]);
      const result: OnboardingModel[] = await testService.getAll();
      expect(result).to.deep.equal([onboardingModelInstance]);
    });

    it('should create and return an onboardingModel instance', async () => {
      sandbox.stub(onboardingModel, 'countDocuments').resolves(0);
      sandbox.stub(onboardingModel, 'create').resolves(onboardingModelInstance);
      const result: OnboardingModel = await testService.create(onboardingModelInstance);
      expect(result).to.deep.equal(onboardingModelInstance);
    });

    it('should return an onboarding instance', async () => {
      sandbox.stub(onboardingModel, 'findOne').resolves(onboardingModelInstance);
      const result: OnboardingDto = await testService.getPartner({ name: onboardingModelInstance.name });
      expect(result).to.deep.equal(onboardingModelInstance);
    });

    it('should update and return an onboarding instance', async () => {
      const newLogo: string = '#black-swan';
      const updatedOnboardingModelInstance: OnboardingModel = Object.assign({ }, onboardingModelInstance);
      updatedOnboardingModelInstance.logo = newLogo;

      sandbox.stub(onboardingModel, 'findOneAndUpdate').resolves(updatedOnboardingModelInstance);
      const result: OnboardingModel = await testService.update(onboardingModelInstance.name, onboardingModelInstance);
      expect(result).to.deep.equal(updatedOnboardingModelInstance);
    });

  });
});

import 'mocha';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { Model, Types } from 'mongoose';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as uuid from 'uuid';

import { BusinessModel } from '../../../../src/models/business.model';
import { InstalledApp } from '../../../../src/models/interfaces/installed-app';
import { UuidDocument } from '../../../../src/models/interfaces/uuid-document';
import { SectionsEnum } from '../../../../src/stepper/enums';
import { BusinessStepModel, DefaultStepModel } from '../../../../src/stepper/models';
import { BusinessStepService } from '../../../../src/stepper/services/business-step.service';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('BusinessStepService', () => {
  let sandbox: sinon.SinonSandbox;
  let businessStepModel: Model<BusinessStepModel>;
  let testService: BusinessStepService;

  const businessStepModelInstances: BusinessStepModel[] = [
    {
      businessId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      isActive: true,
      section: SectionsEnum.Builder,
      step: 'shop',
    } as any,
    {
      businessId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      isActive: false,
      section: SectionsEnum.Checkout,
      step: 'shop',
    } as any,
  ];

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
        setupStep: 'test',
        statusChangedAt: new Date(),
        subscription: {} as any,
      } as InstalledApp,
    ] as Types.DocumentArray<InstalledApp & UuidDocument>,
  } as any;

  before(() => {
    businessStepModel = {
      create: (): any => {},
      deleteMany: (): any => {},
      find: (): any => {},
      findOneAndUpdate: (): any => {},
      updateMany: (): any => {},
    } as any;
    testService = new BusinessStepService(businessStepModel);
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    sandbox = undefined;
  });

  describe('getListForSection()', () => {
    it('should find sections for business', async () => {
      sandbox.stub(businessStepModel, 'find').resolves([businessModelInstance[0]]);
      const result: BusinessStepModel[] = await testService.getListForSection(
        SectionsEnum.Builder,
        businessModelInstance,
      );

      expect(result).to.deep.equal([businessModelInstance[0]]);
    });
  });

  describe('setActive()', () => {
    it("should set 'isActive' to true", async () => {
      sandbox.stub(businessStepModel, 'updateMany');
      sandbox.stub(businessStepModel, 'findOneAndUpdate').resolves(businessStepModelInstances[0]);
      const result: BusinessStepModel = await testService.setActive(
        businessStepModelInstances[0],
        businessModelInstance,
      );
      expect(result).to.deep.equal(businessStepModelInstances[0]);
      expect(businessStepModel.updateMany).calledOnceWith(
        {
          businessId: businessModelInstance._id,
          section: businessStepModelInstances[0].section,
        },
        {
          $set: {
            isActive: false,
          },
        },
      );
    });
  });

  describe('createStepsForBusiness()', () => {
    it('should create step for business', async () => {
      sandbox.stub(businessStepModel, 'create');
      testService.createStepsForBusiness(businessModelInstance, 'shop', [
        {
          action: 'some action',
          allowSkip: true,
          order: 1,
          section: SectionsEnum.Builder,
          title: 'some title',
        } as DefaultStepModel,
      ]);
      expect(businessStepModel.create).calledOnce;
    });
  });

  describe('deleteStepsForBusiness()', () => {
    it('should delete steps for business', async () => {
      sandbox.stub(businessStepModel, 'deleteMany');
      await testService.deleteStepsForBusiness(businessModelInstance);
      expect(businessStepModel.deleteMany).calledOnce;
    });
  });
});

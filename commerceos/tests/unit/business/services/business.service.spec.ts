import { EventDispatcher } from '@pe/nest-kit';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import 'mocha';
import { Model, Types } from 'mongoose';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as uuid from 'uuid';

import { BusinessEvents } from '../../../../src/business/enums';
import { BusinessService } from '../../../../src/business/services/business.service';
import { BusinessModel } from '../../../../src/models/business.model';
import { DefaultAppsModel } from '../../../../src/models/default-apps.model';
import { InstalledApp } from '../../../../src/models/interfaces/installed-app';
import { UuidDocument } from '../../../../src/models/interfaces/uuid-document';
import { NotifierService } from '../../../../src/business/services';
import { ThemeSettingsDto } from '../../../../src/business/dto';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('test BusinessService', () => {
  let sandbox: sinon.SinonSandbox;
  let testService: BusinessService;
  let businessModel: Model<BusinessModel>;
  let defaultAppsModel: Model<DefaultAppsModel>;
  let eventDispatcher: EventDispatcher;
  let notifier: NotifierService;

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
    businessModel = {
      create: (): BusinessModel => null,
      find: (): any => {},
      findById: (): any => {},
      findOneAndUpdate: (): BusinessModel => null,
      findOneAndDelete: (): any => {},
      limit: (): any => {},
      skip: (): any => {},
    } as any;

    defaultAppsModel = {
      find: (): any => { },
      findById: (): any => { },
    } as any;

    eventDispatcher = {
      dispatch: (): any => {},
    } as any;

    notifier = {
      notifyTakeTourBatch: (): any => {},
    } as any;

    testService = new BusinessService(businessModel, defaultAppsModel, eventDispatcher, notifier);
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    sandbox = undefined;
  });

  describe('create()', () => {
    it('should create business model and dispatch business created event', async () => {
      sandbox.stub(eventDispatcher, 'dispatch');
      sandbox.stub(businessModel, 'findOneAndUpdate').resolves(businessModelInstance);

      const result: BusinessModel = await testService.create({
        _id: businessModelInstance._id,
        createdAt: new Date().toString(),
        companyDetails: {},
        themeSettings: {} as ThemeSettingsDto,
      });
      expect(result).to.equal(businessModelInstance);
    });
  });

  describe('findOneById()', () => {
    it('should find business model instance by id', async () => {
      const mockQuery: any = {
        exec: sandbox.stub().resolves(businessModelInstance),
      } as any;
      sinon.stub(businessModel, 'findById').returns(mockQuery);
      const result: BusinessModel = await testService.findOneById(businessModelInstance._id);
      expect(result).to.equal(businessModelInstance);
    });
  });

  describe('getList()', () => {
    it('should query business model', async () => {
      const mockQuery: any = {
        exec: sandbox.stub().resolves([businessModelInstance]),
        limit(): any {
          return this;
        },
        skip(): any {
          return this;
        },
      };
      sandbox.stub(businessModel, 'find').returns(mockQuery);
      const result: BusinessModel[] = await testService.getList({}, 5, 0);
      expect(result).to.deep.equal([businessModelInstance]);
    });
  });

  describe('deleteOneById()', () => {
    it('should delete business Model instance for given id', async () => {
      sandbox.stub(businessModel, 'findOneAndDelete').resolves(businessModelInstance);
      sandbox.stub(eventDispatcher, 'dispatch');
      await testService.deleteOneById(businessModelInstance._id);
      expect(eventDispatcher.dispatch).calledOnceWith(BusinessEvents.BusinessRemoved);
      expect(businessModel.findOneAndDelete).calledOnceWith({ _id: businessModelInstance._id });
    });
  });
});

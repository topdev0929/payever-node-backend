import { AccessTokenPayload, RolesEnum, UserRoleInterface, UserRolePartner } from '@pe/nest-kit';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import 'mocha';
import { Model, Types } from 'mongoose';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as uuid from 'uuid';

import { ToggleInstallAppDto } from '../../../../src/apps/dto/toggle-install-app.dto';
import { SetupStatusEnum } from '../../../../src/apps/enums/setup-status.dto';
import { RegisteredApp } from '../../../../src/apps/interfaces/registered-app';
import { AppsEventsProducer } from '../../../../src/apps/producers/apps-events.producer';
import { BusinessAppsService } from '../../../../src/apps/services/business.apps.service';
import { BusinessService } from '../../../../src/business/services/business.service';
import { BusinessModel } from '../../../../src/models/business.model';
import { DashboardAppModel } from '../../../../src/models/dashboard-app.model';
import { DashboardInfo } from '../../../../src/models/interfaces/dashboard-app/dashboard-info';
import { PlatformHeader } from '../../../../src/models/interfaces/dashboard-app/platform-header';
import { InstalledApp } from '../../../../src/models/interfaces/installed-app';
import { UuidDocument } from '../../../../src/models/interfaces/uuid-document';
import { NotifierService } from '../../../../src/business/services';
import { ToggleInstallDto } from '../../../../src/apps/dto';
import { OriginAppService } from '../../../../src/services/origin-app.service';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('test BusinessAppsService', () => {
  let sandbox: sinon.SinonSandbox;
  let testService: BusinessAppsService;
  let businessService: BusinessService;
  let appsEventsProducer: AppsEventsProducer;
  let businessModel: Model<BusinessModel>;
  let dashboardAppModel: Model<DashboardAppModel>;
  let notifier: NotifierService;
  let originAppsService: OriginAppService;

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
        subscription: { } as any,
      } as InstalledApp,
    ] as Types.DocumentArray<InstalledApp & UuidDocument>,
    save: (): any => { },
    findOneAndUpdate: (): any => {},
    populate(): any {
      return this;
    },
    execPopulate(): any {
      return this;
    },
  } as any;

  const user: AccessTokenPayload = {
    email: 'some@email.de',
    firstName: 'Narayan',
    id: uuid.v4(),
    isVerified: true,
    lastName: 'Ghimire',
    roles: [
      {
        name: RolesEnum.merchant,
        permissions: [
          {
            acls: [
              {
                microservice: 'commerceos',
              },
            ],
            businessId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
          },
        ],
      },
    ],
    tokenId: uuid.v4(),
    tokenType: 0,
    getRole: (): any => { },
    hasRole: (): any => { },
  } as any;

  before(() => {
    businessModel = {
      find: (): any => { },
      findOneAndUpdate: (a, b, c): any => { },
    } as any;
    dashboardAppModel = {
      find: (): any => { },
      findOne: (): any => { },
      findById: (): any => { },
    } as any;
    businessService = {
      findOneById: (): any => { },
      getOrCreate: (): BusinessModel => null,
    } as any;
    appsEventsProducer = {
      produceAppInstalledEvent: (): any => { },
      produceAppUninstalledEvent: (): any => { },
      installApp: (): any => { },
      uninstallApp: (): any => { },
    } as any;

    notifier = {
      notifyTakeTour: (): any => { },
      cancelTakeTourNotification: (): any => { },
    } as any;

    originAppsService = {
      isAppAvailableForOrigin: (): any => {},
      findAppIdsByOrigin: (): any => {},
      findAppIdsByBusiness: (): any => {},
    } as any;

    testService = new BusinessAppsService(
      businessModel,
      dashboardAppModel,
      businessService,
      appsEventsProducer,
      notifier,
      originAppsService,
    );
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    sandbox = undefined;
  });

  describe('test toggleInstalled()', () => {
    it('should install app when ap is linked', async () => {
      sandbox.stub(appsEventsProducer, 'produceAppInstalledEvent').resolves(null);
      sandbox.stub(appsEventsProducer, 'produceAppUninstalledEvent').resolves(null);
      sandbox.stub(appsEventsProducer, 'installApp').resolves(null);
      sandbox.stub(appsEventsProducer, 'uninstallApp').resolves(null);
      sandbox.stub(businessService, 'getOrCreate').resolves(businessModelInstance);
      sandbox.spy(businessModelInstance, 'save');
      sandbox.stub(businessModel, 'findOneAndUpdate').resolves(businessModelInstance);
      sandbox.stub;
      const toggleInstallDto: ToggleInstallDto = {
        installed: true,
        setupStatus: SetupStatusEnum.NotStarted,
        code: 'code',
      };

      await testService.toggleInstalled(toggleInstallDto, businessModelInstance._id, '11111111-1111-1111-1111-111111111111');
      expect(appsEventsProducer.produceAppInstalledEvent).calledOnce;
      expect(businessModelInstance.installedApps[0].installed).to.eq(true);
    });

    it('should uninstall app when ap is linked', async () => {
      sandbox.stub(appsEventsProducer, 'produceAppInstalledEvent').resolves(null);
      sandbox.stub(appsEventsProducer, 'produceAppUninstalledEvent').resolves(null);
      sandbox.stub(appsEventsProducer, 'installApp').resolves(null);
      sandbox.stub(appsEventsProducer, 'uninstallApp').resolves(null);
      sandbox.stub(businessService, 'getOrCreate').resolves(businessModelInstance);
      sandbox.spy(businessModelInstance, 'save');
      sandbox.stub(businessModel, 'findOneAndUpdate').resolves(businessModelInstance);

      sandbox.stub;
      const toggleInstallDto: ToggleInstallDto = {
        installed: false,
        setupStatus: SetupStatusEnum.NotStarted,
        code: 'code',
      };

      await testService.toggleInstalled(toggleInstallDto, businessModelInstance._id, '11111111-1111-1111-1111-111111111111');
      expect(appsEventsProducer.produceAppUninstalledEvent).calledOnce;
      expect(businessModelInstance.installedApps[0].installed).to.eq(false);
    });
  });

  it('should install app when ap is not linked', async () => {
    const installedAppInstance: InstalledApp = {
      _id: uuid.v4(),
      app: '11111111-1111-1111-1111-111111111111',
      code: 'coupons',
      installed: true,
      setupStatus: 'notStarted',
      setupStep: 'test',
      statusChangedAt: new Date(),
      subscription: { } as any,
    } as InstalledApp;
    const businessModelInstance1: BusinessModel = {
      _id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      installedApps: {
        create: sandbox.stub().returns(installedAppInstance),
        find: sandbox.stub().returns(null),
        push: sandbox.stub(),
      },
      save: (): any => { },
      findOneAndUpdate: (): any => {},
      populate(): any {
        return this;
      },
      execPopulate(): any {
        return this;
      },
      create(): any {
        return this;
      },
      push(): any { },
    } as any;
    const toggleInstallDto: ToggleInstallDto = {
      installed: true,
      setupStatus: SetupStatusEnum.NotStarted,
      code: 'code',
    };
    sandbox.stub(appsEventsProducer, 'produceAppInstalledEvent').resolves(null);
    sandbox.stub(appsEventsProducer, 'produceAppUninstalledEvent').resolves(null);
    sandbox.stub(appsEventsProducer, 'installApp').resolves(null);
    sandbox.stub(appsEventsProducer, 'uninstallApp').resolves(null);
    sandbox.stub(businessService, 'getOrCreate').resolves(businessModelInstance1);
    sandbox.stub(businessModelInstance1, 'save');
    sandbox.stub(businessModel, 'findOneAndUpdate').resolves(businessModelInstance1);


    await testService.toggleInstalled(toggleInstallDto, businessModelInstance._id, uuid.v4());
    expect(appsEventsProducer.produceAppInstalledEvent).calledOnce;
  });

  describe('test get()', () => {
    it('should return registered apps of user', async () => {
      const registeredApps: any[] = [{
        _id: uuid.v4(),
        allowedAcls: { read: true, create: false },
        bootstrapScriptUrl: 'www.payever.de',
        code: 'abc123',
        dashboardInfo: {
          toObject: sandbox.stub().returns({ }),
        } as any,
        access: { business: { isDefault: true, url: 'www.payever.org' }},
        installed: true,
        microUuid: uuid.v4(),
        order: 1,
        platformHeader: {
          toObject: sandbox.stub().returns({ }),
        } as any,
        statusChangedAt: new Date(),
        setupStatus: 'notStarted',
        setupStep: 'test',
        tag: 'sometag',
      }];
      const resultData: RegisteredApp[] = [{
        _id: registeredApps[0]._id,
        allowedAcls: { read: true, create: false },
        bootstrapScriptUrl: 'www.payever.de',
        businessTypes: [
          'business',
        ],
        code: 'abc123',
        appName:'commerceos.abc123.app.name',
        dashboardInfo: { } as any,
        default: true,
        installed: true,
        microUuid: registeredApps[0]._id,
        order: 1,
        platformHeader: { } as any,
        statusChangedAt: registeredApps[0].statusChangedAt,
        setupStatus: 'notStarted',
        setupStep: 'test',
        tag: 'sometag',
        url: 'www.payever.org',
      }];
      const businessModelInstance1: BusinessModel = {
        _id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        installedApps: {
          map: sandbox.stub().returns([{ ...registeredApps[0], app: registeredApps[0] }]),
          find: sandbox.stub().returns({ ...registeredApps[0], app: registeredApps[0] }),
          filter: sandbox.stub().returns({ 
            ...registeredApps[0], app: registeredApps[0],
            map: sandbox.stub().returns([RegisteredApp.parse({ ...registeredApps[0], app: registeredApps[0] })]),      
          }),
        },
        populate(): any {
          return this;
        },
        execPopulate(): any {
          return this;
        },
      } as any;
      sandbox.stub(dashboardAppModel, 'find').returns([] as any);
      sandbox.stub(businessService, 'findOneById').resolves(businessModelInstance1);
      sandbox.stub(user, 'hasRole').returns(true);

      const result = await testService.get(businessModelInstance._id, user);
      expect(result).to.deep.equal(resultData);
    });

    it('should return registered app of business owner',async () => {
       const registeredApps: any[] = [{
        _id: uuid.v4(),
        allowedAcls: { read: true, create: false },
        bootstrapScriptUrl: 'www.payever.de',
        code: 'abc123',
        dashboardInfo: {
          toObject: sandbox.stub().returns({ }),
        } as any,
        access: { business: { isDefault: true, url: 'www.payever.org' }},
        installed: true,
        microUuid: uuid.v4(),
        order: 1,
        platformHeader: {
          toObject: sandbox.stub().returns({ }),
        } as any,
        statusChangedAt: new Date(),
        setupStatus: 'notStarted',
        setupStep: 'test',
        tag: 'sometag',
      }];

      const resultData: RegisteredApp[] = [{
        _id: registeredApps[0]._id,
        allowedAcls: { read: true, create: false },
        bootstrapScriptUrl: 'www.payever.de',
        businessTypes: [
          'business',
        ],
        code: 'abc123',
        appName:'commerceos.abc123.app.name',
        dashboardInfo: { } as any,
        default: true,
        installed: true,
        microUuid: registeredApps[0]._id,
        order: 1,
        platformHeader: { } as any,
        statusChangedAt: registeredApps[0].statusChangedAt,
        setupStatus: 'notStarted',
        setupStep: 'test',
        tag: 'sometag',
        url: 'www.payever.org',
      }];

      const businessModelInstance1: BusinessModel = {
        _id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        installedApps: {
          map: sandbox.stub().returns([{ ...registeredApps[0], app: registeredApps[0] }]),
          find: sandbox.stub().returns({ ...registeredApps[0], app: registeredApps[0] }),
          filter: sandbox.stub().returns({ 
            ...registeredApps[0], app: registeredApps[0],
            map: sandbox.stub().returns([RegisteredApp.parse({ ...registeredApps[0], app: registeredApps[0] })]),      
          }),
        },
        owner: user.id,
        populate(): any {
          return this;
        },
        execPopulate(): any {
          return this;
        },
      } as any;

      const merchantRole: UserRoleInterface = {
        name: RolesEnum.merchant,
        permissions: [
          {
            acls: [
              {
                microservice: 'commerceos',
              },
            ],
            businessId: uuid.v4(),
          },
          {
            acls: [
              {
                microservice: 'commerceos',
              },
            ],
            businessId: businessModelInstance1._id,
          },
        ],
      } as any;
      
      sandbox.stub(dashboardAppModel, 'find').returns([] as any);
      sandbox.stub(businessService, 'findOneById').resolves(businessModelInstance1);
      sandbox.stub(user, 'hasRole').returns(false);
      sandbox.stub(user, 'getRole').returns(merchantRole as any);

      const result = await testService.get(businessModelInstance._id, user);
      expect(result).to.deep.equal(resultData);
    })

    it('should return registered apps of user when the user has admin role', async () => {
      const registeredApps: any[] = [{
        _id: uuid.v4(),
        allowedAcls: { read: true, create: false },
        bootstrapScriptUrl: 'www.payever.de',
        code: 'abc123',
        dashboardInfo: {
          toObject: sandbox.stub().returns({ }),
        } as any,
        access: { business: { isDefault: true, url: 'www.payever.org' }},
        installed: true,
        microUuid: uuid.v4(),
        order: 1,
        platformHeader: {
          toObject: sandbox.stub().returns({ }),
        } as any,
        statusChangedAt: new Date(),
        setupStatus: 'notStarted',
        setupStep: 'test',
        tag: 'sometag',
      }];
      const resultData: RegisteredApp[] = [{
        _id: registeredApps[0]._id,
        allowedAcls: { read: true, create: false },
        bootstrapScriptUrl: 'www.payever.de',
        businessTypes: [
          'business',
        ],
        code: 'abc123',
        appName:'commerceos.abc123.app.name',
        dashboardInfo: { } as any,
        default: true,
        installed: true,
        microUuid: registeredApps[0]._id,
        order: 1,
        platformHeader: { } as any,
        statusChangedAt: registeredApps[0].statusChangedAt,
        setupStatus: 'notStarted',
        setupStep: 'test',
        tag: 'sometag',
        url: 'www.payever.org',
      }];
      const businessModelInstance1: BusinessModel = {
        _id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        installedApps: {
          map: sandbox.stub().returns([{ ...registeredApps[0], app: registeredApps[0] }]),
          find: sandbox.stub().returns({ ...registeredApps[0], app: registeredApps[0] }),
          filter: sandbox.stub().returns({ 
            ...registeredApps[0], app: registeredApps[0],
            map: sandbox.stub().returns([RegisteredApp.parse({ ...registeredApps[0], app: registeredApps[0] })]),      
          }),
        },
        populate(): any {
          return this;
        },
        execPopulate(): any {
          return this;
        },
      } as any;
      sandbox.stub(dashboardAppModel, 'find').returns([] as any);
      sandbox.stub(businessService, 'findOneById').resolves(businessModelInstance1);
      sandbox.stub(user, 'hasRole').returns(true);

      const result = await testService.get(businessModelInstance._id, user);
      expect(result).to.deep.equal(resultData);
    });

    it('should return registered apps of user when the user is not admin and does not have merchant role', async () => {
      const registeredApps: RegisteredApp[] = [{
        _id: uuid.v4(),
        allowedAcls: { read: true, create: false },
        bootstrapScriptUrl: 'www.payever.de',
        code: 'abc123',
        appName:'commerceos.abc123.app.name',
        dashboardInfo: { } as DashboardInfo,
        default: true,
        installed: true,
        microUuid: uuid.v4(),
        order: 1,
        platformHeader: { } as PlatformHeader,
        statusChangedAt: new Date(),
        setupStatus: 'notStarted',
        setupStep: 'test',
        tag: 'sometag',
        url: 'www.payever.org',
      }];
      const businessModelInstance1: BusinessModel = {
        _id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        installedApps: {
          map: sandbox.stub().returns(registeredApps),
          filter: sandbox.stub().returns({ 
            ...registeredApps[0], app: registeredApps[0],
            map: sandbox.stub().returns([]),      
          }),
        },
        populate(): any {
          return this;
        },
        execPopulate(): any {
          return this;
        },
      } as any;
      sandbox.stub(dashboardAppModel, 'find').returns([] as any);
      sandbox.stub(businessService, 'findOneById').resolves(businessModelInstance1);
      sandbox.stub(user, 'hasRole').returns(false);
      sandbox.stub(user, 'getRole').returns(undefined);

      const result = await testService.get(businessModelInstance._id, user);
      expect(result).to.deep.equal([]);
    });

    it('should return registered apps of user when the user is not admin but merchant role', async () => {
      const registeredApps: any[] = [{
        _id: uuid.v4(),
        allowedAcls: { read: true, create: false },
        bootstrapScriptUrl: 'www.payever.de',
        code: 'abc123',
        dashboardInfo: {
          toObject: sandbox.stub().returns({ }),
        } as any,
        access: { business: { isDefault: true, url: 'www.payever.org' }},
        installed: true,
        microUuid: uuid.v4(),
        order: 1,
        platformHeader: {
          toObject: sandbox.stub().returns({ }),
        } as any,
        statusChangedAt: new Date(),
        setupStatus: 'notStarted',
        setupStep: 'test',
        tag: 'sometag',
      }];
      const resultData: RegisteredApp[] = [{
        _id: registeredApps[0]._id,
        allowedAcls: { read: true, create: false },
        bootstrapScriptUrl: 'www.payever.de',
        businessTypes: [
          'business',
        ],
        code: 'abc123',
        appName:'commerceos.abc123.app.name',
        dashboardInfo: { } as any,
        default: true,
        installed: true,
        microUuid: registeredApps[0]._id,
        order: 1,
        platformHeader: { } as any,
        statusChangedAt: registeredApps[0].statusChangedAt,
        setupStatus: 'notStarted',
        setupStep: 'test',
        tag: 'sometag',
        url: 'www.payever.org',
      }];
      const businessModelInstance1: BusinessModel = {
        _id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        installedApps: {
          map: sandbox.stub().returns([{ ...registeredApps[0], app: registeredApps[0] }]),
          find: sandbox.stub().returns({ ...registeredApps[0], app: registeredApps[0] }),
          filter: sandbox.stub().returns({ 
            ...registeredApps[0], app: registeredApps[0],
            map: sandbox.stub().returns([RegisteredApp.parse({ ...registeredApps[0], app: registeredApps[0] })]),      
          }),
        },
        populate(): any {
          return this;
        },
        execPopulate(): any {
          return this;
        },
      } as any;
      const merchantRole: UserRoleInterface = {
        name: RolesEnum.merchant,
        permissions: [
          {
            acls: [
              {
                microservice: 'commerceos',
              },
            ],
            businessId: uuid.v4(),
          },
          {
            acls: [
              {
                microservice: 'commerceos',
              },
            ],
            businessId: uuid.v4(),
          },
        ],
      } as any;
      sandbox.stub(dashboardAppModel, 'find').returns([] as any);
      sandbox.stub(businessService, 'findOneById').resolves(businessModelInstance1);
      sandbox.stub(user, 'hasRole').returns(false);
      sandbox.stub(user, 'getRole').returns(merchantRole as any);
      const result: RegisteredApp[] = await testService.get(businessModelInstance1._id, user);
      expect(result).to.deep.equal(resultData);
    });
    it('should return registered apps of user when the user is not admin but merchant role', async () => {
      const registeredAppInstance: RegisteredApp = {
        _id: uuid.v4(),
        allowedAcls: { read: true, create: false },
        bootstrapScriptUrl: 'www.payever.de',
        code: 'commerceos',
        dashboardInfo: { } as DashboardInfo,
        default: true,
        installed: true,
        microUuid: uuid.v4(),
        order: 1,
        platformHeader: { } as PlatformHeader,
        statusChangedAt: new Date(),
        setupStatus: 'notStarted',
        tag: 'sometag',
        url: 'www.payever.org',
      } as RegisteredApp;
      const businessModelInstance1: BusinessModel = {
        _id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        installedApps: {
          map: sandbox.stub().returns([registeredAppInstance]),
          filter: sandbox.stub().returns({ 
            ...registeredAppInstance, app: registeredAppInstance,
            map: sandbox.stub().returns([]),      
          }),
        },
        populate(): any {
          return this;
        },
        execPopulate(): any {
          return this;
        },
      } as any;
      const merchantRole: UserRoleInterface = {
        name: RolesEnum.merchant,
        permissions: [
          {
            acls: [
              {
                microservice: 'commerceos',
                read: true,
              },
            ],
            businessId: uuid.v4(),
          },
          {
            acls: [
              {
                microservice: 'commerceos',
              },
            ],
            businessId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
          },
        ],
      } as any;
      sandbox.stub(dashboardAppModel, 'find').returns([] as any);
      sandbox.stub(businessService, 'findOneById').resolves(businessModelInstance1);
      sandbox.stub(user, 'hasRole').returns(false);
      sandbox.stub(user, 'getRole').returns(merchantRole as any);

      const result: RegisteredApp[] = await testService.get(businessModelInstance1._id, user);

      expect(result).to.deep.equal([]);
    });
  });

  describe('test getBusinessList()', () => {
    it('should return list of businessmodel instances matching the query', async () => {
      const mockQuery: any = {
        limit(): any {
          return this;
        },
        skip(): any {
          return this;
        },
        exec: sandbox.stub().returns([businessModelInstance]),
      };
      sandbox.stub(businessModel, 'find').returns(mockQuery);
      const result: BusinessModel[] = await testService.getBusinessList({ }, 1, 1);
      expect(result).to.deep.equal([businessModelInstance]);
    });
  });
});

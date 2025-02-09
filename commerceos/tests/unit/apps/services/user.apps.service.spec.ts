import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import 'mocha';
import { Model } from 'mongoose';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as uuid from 'uuid';

import { ToggleInstallAppDto } from '../../../../src/apps/dto/toggle-install-app.dto';
import { RegisteredApp } from '../../../../src/apps/interfaces/registered-app';
import { UserAppsService } from '../../../../src/apps/services/user.apps.service';
import { UserService } from '../../../../src/apps/services/user.service';
import { DashboardApp } from '../../../../src/models/interfaces/dashboard-app';
import { InstalledApp } from '../../../../src/models/interfaces/installed-app';
import { UserModel } from '../../../../src/models/user.model';
import { ThemeSettingsDto } from '../../../../src/business/dto';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('test UserAppsService', () => {
  let sandbox: sinon.SinonSandbox;
  let testService: UserAppsService;
  let userModel: Model<UserModel>;
  let userService: UserService;

  const dashboardAppInstance: DashboardApp = {
    _id: uuid.v4(),
    code: '1323sfs',
    tag: 'some tag',
    access: {} as any,
    bootstrapScriptUrl: 'www.payever.de',
    order: 1,
  } as DashboardApp;

  const installedAppInstance: InstalledApp = {
    _id: uuid.v4(),
    app: dashboardAppInstance,
    code: 'coupons',
    installed: false,
    setupStatus: 'notStarted',
    statusChangedAt: new Date(),
    subscription: {} as any,
  } as any;

  const userModelInstance: UserModel = {
    _id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    installedApps: [installedAppInstance as any] as any,
    themeSettings: {} as ThemeSettingsDto,
    execPopulate: (): any => {},
    populate(): any {
      return this;
    },
    save: (): any => {},
  } as any;

  before(() => {
    userService = {
      getOrCreate: (): any => {},
    } as any;
    userModel = {} as any;
    testService = new UserAppsService(
      userModel,
      {
        find: () => Promise.resolve([dashboardAppInstance]),
      } as any,
      userService,
    );
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    sandbox = undefined;
  });

  describe('get()', () => {
    it('should return the list of installed apps for user', async () => {
      sandbox.stub(userService, 'getOrCreate').resolves(userModelInstance);
      const registeredAppInstance: any = {
        _id: dashboardAppInstance._id,
        bootstrapScriptUrl: dashboardAppInstance.bootstrapScriptUrl,
        code: dashboardAppInstance.code,
        installed: false,
        microUuid: dashboardAppInstance._id,
        order: dashboardAppInstance.order,
        setupStatus: 'notStarted',
        tag: 'some tag',
      } as any;

      const result: RegisteredApp[] = await testService.get(userModelInstance._id, 'admin');
      result.forEach((element: any) => {
        Object.entries(registeredAppInstance).forEach(([key, value]: any) => {
          expect(element[key]).to.deep.equal(value);
        });
      });
    });
  });
  describe('toggleInstalled()', () => {
    it('should return find the installed app and return it', async () => {
      const userModelInstanceLocal: UserModel = {
        installedApps: [
          {
            app: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
          } as any,
        ] as any,
        save: (): any => {},
      } as any;
      const toggleInstallAppDto: ToggleInstallAppDto = {
        microUuid: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        installed: true,
      } as any;
      sandbox.stub(userService, 'getOrCreate').resolves(userModelInstanceLocal);
      sandbox.stub(userModelInstanceLocal, 'save');

      await testService.toggleInstalled(toggleInstallAppDto, uuid.v4(), 'admin');
      expect(userModelInstanceLocal.save).calledOnce;
    });

    it('should return find the installed app and return it', async () => {
      const userModelInstanceLocal: UserModel = {
        installedApps: {
          find: sandbox.stub().returns(null),
          create: sandbox.stub().resolves({} as InstalledApp),
          push: sandbox.stub(),
        },
        save: sandbox.stub(),
      } as any;
      const toggleInstallAppDto: ToggleInstallAppDto = {
        microUuid: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        installed: true,
      } as any;
      sandbox.stub(userService, 'getOrCreate').resolves(userModelInstanceLocal);

      await testService.toggleInstalled(toggleInstallAppDto, uuid.v4(), 'admin');
      expect(userModelInstanceLocal.save).calledOnce;
    });
  });
});

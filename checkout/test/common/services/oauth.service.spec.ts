import { Test, TestingModule } from '@nestjs/testing';
import { AccessTokenPayload, PermissionInterface, RolesEnum, UserRoleInterface } from '@pe/nest-kit';
import * as chai from 'chai';
import 'mocha';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { OauthService } from './oauth.service';

chai.use(sinonChai);
const expect: Chai.ExpectStatic = chai.expect;

// tslint:disable no-big-function
describe('OauthService ', async () => {
  let sandbox: sinon.SinonSandbox;
  let oauthService: OauthService;

  before(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OauthService],
    })
    .compile();

    oauthService = module.get<OauthService>(OauthService);
  });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
  });

  afterEach(async () => {
    sandbox.restore();
    sandbox = undefined;
  });

  describe('getOauthUserBusiness', () => {
    it('user authenticated', async () => {
      const user: AccessTokenPayload = new AccessTokenPayload();
      const businessId: string = 'id1';
      user.roles = [];
      user.roles.push(createUser(RolesEnum.oauth, businessId));

      expect(oauthService.getOauthUserBusiness(user)).to.equal(businessId);
    });

    it('user is anonymous', async () => {
      const user: AccessTokenPayload = new AccessTokenPayload();
      const businessId: string = 'id1';
      user.roles = [];
      user.roles.push(createUser(RolesEnum.anonymous, businessId));

      expect(oauthService.getOauthUserBusiness(user)).to.equal(null);
    });

    it('user has no role', async () => {
      const user: AccessTokenPayload = new AccessTokenPayload();
      user.roles = [];

      expect(oauthService.getOauthUserBusiness(user)).to.equal(null);
    });

    it('user has several roles', async () => {
      const user: AccessTokenPayload = new AccessTokenPayload();
      const businessId1: string = 'id1';
      const businessId2: string = 'id2';
      const businessId3: string = 'id3';
      user.roles = [];

      user.roles.push(createUser(RolesEnum.admin, businessId2));
      user.roles.push(createUser(RolesEnum.customer, businessId3));
      user.roles.push(createUser(RolesEnum.oauth, businessId1));

      expect(oauthService.getOauthUserBusiness(user)).to.equal(businessId1);
    });
  });

  function createUser(name: RolesEnum, businessId: string): UserRoleInterface {
    const myPermissions: PermissionInterface[] = [];
    myPermissions.push({businessId: businessId, acls: null});

    return { name: name, permissions: myPermissions };
  }
});

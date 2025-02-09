import { Test } from '@nestjs/testing';
import { AclInterface } from '@pe/nest-kit';
import * as chai from 'chai';
import 'mocha';
import * as sinon from 'sinon';
import { GroupsService } from '../../../../src/employees/services/groups.service';

const expect = chai.expect;

const employeeModel = {
  findOne: async () => {},
  countDocuments: async () => {},
  deleteMany: async () => {},
};

const groupModel = {
  find: async () => {},
  findOne: async () => {},
  create: async () => {},
  isPermanentlyBlocked: async () => false,
  getActiveBlock: async () => {},
};

const eventsProducer = {
  sendMessage: async () => {},
};

describe('Testing suspicious activity  service', () => {
  let sandbox;
  let groupsService: GroupsService;

  before(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GroupsService,
        {
          provide: 'GroupsModel',
          useValue: groupModel,
        },
        {
          provide: 'EventsProducer',
          useValue: eventsProducer,
        },
      ],
    }).compile();

    groupsService = module.get<GroupsService>(GroupsService);
  });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
  });

  afterEach(async () => {
    await sandbox.restore();
    sandbox = undefined;
  });

  it('should get enabled acls', () => {
    const acls: AclInterface[] = [{ microservice: 'checkout', create: false, delete: true }];
    const enabledAcls = GroupsService.getEnabledAcls(acls);
    expect(JSON.stringify(enabledAcls)).to.be.equal('[{"microservice":"checkout","delete":true}]');
  });

  it('should disable acl duplicates', () => {
    const original: AclInterface[] = [{ microservice: 'checkout', delete: true, create: true }];
    const groups: any = [{ acls: [{ microservice: 'checkout', create: true }] }];
    const aclsWithoutDuplicates = GroupsService.disableAclDuplicate(original, groups);
    expect(JSON.stringify(aclsWithoutDuplicates)).to.be.equal('[{"microservice":"checkout","delete":false}]');
  });
});

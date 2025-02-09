import { Test } from '@nestjs/testing';
import * as chai from 'chai';
import 'mocha';
import * as sinon from 'sinon';
import { EmployeeService } from '../../../../src/employees/services/employee.service';
import { GroupsService } from '../../../../src/employees/services/groups.service';
import { EmployeeMessageProducer } from "../../../../src/employees/producer";
import { EmployeeActivityHistorySchema } from '../../../../src/employees/schemas';

const expect = chai.expect;

const employeeModel = {
  findOneAndUpdate: async () => {},
  countDocuments: async () => {},
  deleteMany: async () => {},
  
};

const employeeActivityHistoryModel = {
  findOne: async () => {},
  countDocuments: async () => {},
  create: async () => {},
};

const invitationService = {
  invite: async () => {},
};

const groupModel = {
  find: async () => {},
  findOne: async () => {},
  create: async () => {},
  isPermanentlyBlocked: async () => false,
  getActiveBlock: async () => {},
};

const groupsService = {
  getGroupsByEmployeeId: async () => {},
};

const userService = {
  removePermissions: async () => {},
};

const eventProducer = {
  sendMessage: async () => {},
};

const employeeMessageProducer = {
  produceEmployeeRemovedSynced: async () => {},
};

const permissionService = {
  findOneBy: async () => {},
};

const eventDispatcher = {
  dispatch: async () => {},
};

describe('Testing suspicious activity  service', () => {
  let sandbox;
  let employeeService: EmployeeService;

  before(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EmployeeService,
        {
          provide: 'EmployeeModel',
          useValue: employeeModel,
        },
        {
          provide: 'EmployeeActivityHistoryModel',
          useValue: employeeActivityHistoryModel,
        },
        {
          provide: 'InvitationService',
          useValue: invitationService,
        },
        {
          provide: 'GroupsModel',
          useValue: groupModel,
        },
        {
          provide: 'UserService',
          useValue: userService,
        },
        {
          provide: 'TokenService',
          useValue: {},
        },
        {
          provide: 'GroupsService',
          useValue: groupsService,
        },
        {
          provide: 'EventsProducer',
          useValue: eventProducer,
        },
        {
          provide: 'EmployeeMessageProducer',
          useValue: employeeMessageProducer,
        },
        {
          provide: 'PermissionService',
          useValue: permissionService,
        },
        {
          provide: 'EventDispatcher',
          useValue: eventDispatcher,
        },
      ],
    }).compile();

    employeeService = module.get<EmployeeService>(EmployeeService);
  });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
  });

  afterEach(async () => {
    await sandbox.restore();
    sandbox = undefined;
  });

  it('should get added acls', () => {
    const originalGroup: any = { toObject: () => ({ acls: [{ microservice: 'checkout', edit: true }] }) };
    const newAclsGroup: any = { toObject: () => ({ acls: [{ microservice: 'transactions', create: true }] }) };
    const merged = EmployeeService.getAddedAcls(originalGroup, newAclsGroup);
    expect(JSON.stringify(merged)).to.be.equal('[{"microservice":"transactions","create":true}]');
  });

  it('should get removed acls', () => {
    const originalGroup: any = { toObject: () => ({ acls: [{ microservice: 'checkout', edit: true }] }) };
    const newAclsGroup: any = { toObject: () => ({ acls: [{ microservice: 'checkout', edit: false }] }) };
    const removedAcls = EmployeeService.getRemovedAcls(originalGroup, newAclsGroup);
    expect(JSON.stringify(removedAcls)).to.be.equal('[{"microservice":"checkout","edit":false}]');
  });

  it('should remove employee from group', async () => {
    sandbox.stub(groupsService, 'getGroupsByEmployeeId').callsFake(() => {
      return [{ acls: [] }];
    });
    sandbox.stub(employeeService, 'findOneBy').callsFake((condition) => {
      return { userId: '' };
    });
    sandbox.stub(userService, 'removePermissions').callsFake((employee, business, acls) => {
      expect(JSON.stringify(acls)).to.be.equal('[{"microservice":"checkout","create":false}]');
    });
    await employeeService.removeEmployeeFromGroup('employeeId', 'businessId', [
      { microservice: 'checkout', create: true },
    ]);
  });

  it('should ensure using default acls', () => {
    const original: any = [{ microservice: 'commerceos', read: false, edit: false }];

    const result = [
      { microservice: 'commerceos', read: true, edit: false, create: true, delete: true, update: true},
    ];

    const merged = EmployeeService.ensurePermissions(original);
    expect(merged).to.be.deep.equal(result);
  });

  it('should ensure using default acls - 2 items', () => {
    const original: any = [
      { microservice: 'pos', create: false, read: false, update: false, delete: false },
      { microservice: 'commerceos', read: false, edit: false },
    ];

    const result = [
      { microservice: 'pos', create: false, read: false, update: false, delete: false },
      { microservice: 'commerceos', read: true, edit: false, create: true, delete: true, update: true},

    ];

    const merged = EmployeeService.ensurePermissions(original);
    expect(merged).to.be.deep.equal(result);
  });

  it('should ensure using default acls - default value not exist', () => {
    const original: any = [];

    const result = [
      { microservice: 'commerceos', read: true,  create: true, delete: true, update: true},
    ];

    const merged = EmployeeService.ensurePermissions(original);
    expect(merged).to.be.deep.equal(result);
  });
});

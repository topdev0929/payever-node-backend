import { Test } from '@nestjs/testing';
import * as chai from 'chai';
import 'mocha';
import * as sinon from 'sinon';
import { InvitationService } from '../../../../src/employees/services/invitation.service';
import {
  OWN_EMAIL_ERROR_MESSAGE,
  BLOCKED_EMAIL_ERROR_MESSAGE
} from '../../../../src/employees/constants';
import { CreateEmployeeDto } from '../../../../src/employees/dto';
import { Positions, Status } from '../../../../src/employees/enum';
import { UserTokenInterface } from '@pe/nest-kit';
import { mockEmployee, mockBusinessLocalDocument } from '../../../mocks'

const expect = chai.expect;

const jwtService = {
  sign: async () => { },
  verify: async () => { },
};

const tokenService = {
  issueToken: async () => { },
};

const trustedDomainService = {
  isDomainTrusted: async () => { },
};

const employeeService = {
  deleteEmployee: async () => { },
};


const userService = {
  findOneByEmail: async () => { },
  assignPermissions: async () => { },
};

const permissionService = {
  findOneBy: async () => { },
};

const employeeModel = {
  findOne: async () => { },
  findOneAndUpdate: async () => { },
  create: async () => { },
};

const groupsService = {
  addToGroups: async () => { },
  getGroupById: async () => { },
  getGroups: async () => { },
};

const invitationEventsProducer = {
  produceStaffInvitationEmailMessage: async () => { },
};

const eventProducer = {
  sendMessage: async () => { },
};

const blockEmailService = {
  findOneBy: async () => { },
  checkBlocked: async () => { },
};

const employeeSettingsService = {
  getExpiryHoursByBusinessId: async () => { },
};

const employeeMessageProducer = {
  produceEmployeeRemovedSynced: async () => {},
};

const businessService = {
  findAll: async () => { },
};

describe('Testing invitation service', () => {
  let sandbox;
  let invitationService: InvitationService;

  before(async () => {
    const module = await Test.createTestingModule({
      providers: [
        InvitationService,
        {
          provide: 'JwtService',
          useValue: jwtService,
        },
        {
          provide: 'TrustedDomainService',
          useValue: trustedDomainService,
        },
        {
          provide: 'EmployeeService',
          useValue: employeeService,
        },
        {
          provide: 'TokenService',
          useValue: tokenService,
        },
        {
          provide: 'UserService',
          useValue: userService,
        },
        {
          provide: 'PermissionService',
          useValue: permissionService,
        },
        {
          provide: 'EmployeeModel',
          useValue: employeeModel,
        },
        {
          provide: 'EmployeeMessageProducer',
          useValue: employeeMessageProducer,
        },
        {
          provide: 'GroupsService',
          useValue: groupsService,
        },
        {
          provide: 'InivtationEventsProducer',
          useValue: invitationEventsProducer,
        },
        {
          provide: 'EventsProducer',
          useValue: eventProducer,
        },
        {
          provide: 'EmployeeSettingsService',
          useValue: employeeSettingsService,
        },
        {
          provide: 'BlockEmailService',
          useValue: blockEmailService,
        },
        {
          provide: 'BusinessService',
          useValue: businessService,
        },
      ],
    }).compile();

    invitationService = module.get<InvitationService>(InvitationService);
  });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
  });

  afterEach(async () => {
    await sandbox.restore();
    sandbox = undefined;
  });

  it('Should return appropriate message for untrusted email domain', async () => {
    const user: any = {
      _id: '1',
      email: 'fake@example.com',
    }
    const createEmployeeDto: CreateEmployeeDto = {
      email: 'fake2@mierdamail.com',
      userId: '',
      firstName: '',
      lastName: '',
      address: '',
      fullValidation: true,
      position: Positions.others,
      status: Status.active
    }
    sandbox.stub(userService, 'findOneByEmail').resolves(user);
    sandbox.stub(permissionService, 'findOneBy').resolves({});
    sandbox.stub(employeeModel, 'findOne').returns({ exec: async () => { } });
    sandbox.stub(blockEmailService, 'checkBlocked').returns(true);

    try {
      await invitationService.create(user, '', createEmployeeDto, '', true)
    }
    catch (error) {
      expect(error.message).to.be.equal(BLOCKED_EMAIL_ERROR_MESSAGE);
    }
  });
  it('Should reject adding current user as new employee', async () => {
    const user: any = {
      _id: '1',
      email: 'fake@example.com',
    }
    const createEmployeeDto: CreateEmployeeDto = {
      email: 'fake@example.com',
      userId: '',
      firstName: '',
      lastName: '',
      address: '',
      fullValidation: true,
      position: Positions.others,
      status: Status.active
    }
    sandbox.stub(userService, 'findOneByEmail').returns(user);
    sandbox.stub(permissionService, 'findOneBy').returns({});
    sandbox.stub(employeeModel, 'findOne').returns({ exec: async () => { } });

    try {
      await invitationService.create(user, '', createEmployeeDto, '', true)
    }
    catch (error) {
      expect(error.message).to.be.equal(OWN_EMAIL_ERROR_MESSAGE);
    }
  });

  it('should not let approve an employee theres already approved', async () => {
    const userToken: UserTokenInterface = {
      email: 'any-email',
      firstName: 'any-first-name',
      id: 'any-id',
      isVerified: true,
      lastName: 'any-last-name',
      roles: [],
      tokenId: 'any-token-id',
      tokenType: 0
    }

    try {
      await invitationService.approveEmployee(userToken, mockEmployee, mockBusinessLocalDocument)

    } catch (error) {
      expect(error.message).to.be.equal('Employee has already been approved');
    }
  })

  it('should encode scpecial characters from user email', async () => {
    const email: string = 'test+mail-test.test%test+11@test.com'
    expect(invitationService.encodeEmailSpecialCharacters(email)).to.be.equal('test%2Bmail-test.test%25test%2B11@test.com')
  })
});

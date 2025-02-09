// tslint:disable: object-literal-sort-keys
import { fixture } from '@pe/cucumber-sdk/module';
import { getModelToken } from '@nestjs/mongoose';
import { RolesEnum, RolesMixin, UserRoleCustomer, ApplicationAccessStatusEnum } from '@pe/nest-kit';

import { User, UserInterface } from '../../../src/users/interfaces';
import { UserSchemaName } from '../../../src/users/schemas';
import { usersFactory } from '../../factories/users-factory';
import { PasswordEncoder } from '../../../src/users/tools';
import { BUSINESS_1_ID, CUSTOMER_USER_ID, CUSTOMER_APPLICATION_ACCESS_APPLICATION_ID } from '../const';

const salt: string = '123456789';
const encryptedPassword: string = PasswordEncoder.encodePassword('123456789', salt);

export = fixture<User>(getModelToken(UserSchemaName), usersFactory, [
  {
    _id: CUSTOMER_USER_ID,
    id: CUSTOMER_USER_ID,
    password: '',
    salt: '',
    firstName: 'first-name',
    lastName: 'last-name',
    email: 'user1@payever.de',
    roles: [{
      name: RolesEnum.customer,

      applications: [{
        applicationId: CUSTOMER_APPLICATION_ACCESS_APPLICATION_ID,
        businessId: BUSINESS_1_ID,
        status: ApplicationAccessStatusEnum.PENDING,
        type: 'site',
      }, {
        applicationId: '1e890e9c-ffa2-40e7-99a6-b330bcaaa7c6',
        businessId: BUSINESS_1_ID,
        status: ApplicationAccessStatusEnum.APPROVED,
        type: 'site',
      }, {
        applicationId: '86aac85c-275c-4c63-8133-bfd5573e891c',
        businessId: BUSINESS_1_ID,
        status: ApplicationAccessStatusEnum.DENIED,
        type: 'site',
      }],
      shops: [{
        channelSetId: '48e2751b-9baa-41ea-b1da-235c3a629a8a',
        salt,
        shopPassword: encryptedPassword,
      }],
    } as UserRoleCustomer],
  } as UserInterface & Pick<RolesMixin, 'roles'>,
]);

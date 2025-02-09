import { fixture } from '@pe/cucumber-sdk/module';
import { getModelToken } from '@nestjs/mongoose';
import { PartnerTagName, RolesEnum } from '@pe/nest-kit';

import { User } from '../../../src/users/interfaces';
import { UserSchemaName } from '../../../src/users/schemas';
import { usersFactory } from '../../factories/users-factory';

export = fixture<User>(getModelToken(UserSchemaName), usersFactory, [
  {
    _id: '426fafeb-132f-4ea1-96df-03bd993f126c',
    roles: [{
      email: `user1@payever.de`,
      name: RolesEnum.partner,
      partnerTags: [PartnerTagName.santander],
    }],
  },
  {
    _id: '06916ce0-c9cc-401a-ac18-22fbce616521',
    email: `user2@payever.de`,
    roles: [],
  },
]);

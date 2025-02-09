import * as uuid from 'uuid';
import { partialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import { PartialFactory } from '@pe/cucumber-sdk/module/fixtures/helpers/partial-factory';

import { User } from '../../src/users/interfaces';
import { PasswordEncoder } from '../../src/users/tools';

const salt: string = '12345678';
const encryptedPassword: string = PasswordEncoder.encodePassword('12345678', salt);

const seq: SequenceGenerator = new SequenceGenerator(0);

const defaultFactory: () => any = () => {
  seq.next();

  return {
    _id: uuid.v4(),
    email: `user${seq.current}@payever.de`,
    firstName: `First`,
    lastName: 'Last',
    password: encryptedPassword,
    roles: [],
    salt,
  };
};

export const usersFactory: PartialFactory<User> = partialFactory(defaultFactory);

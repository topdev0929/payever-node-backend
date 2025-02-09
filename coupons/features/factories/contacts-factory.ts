import { partialFactory, PartialFactory } from '@pe/cucumber-sdk';

import { ContactInterface } from '../../src/coupons/interfaces';

const defaultFactory: () => any = () => ({ });

export const contactsFactory: PartialFactory<ContactInterface> = partialFactory(defaultFactory);

import {
  partialFactory,
  PartialFactory,
  DefaultFactory,
} from '@pe/cucumber-sdk';
import { v4 } from 'uuid';

export const pushNotificationDefautFactory: DefaultFactory<any> = (): any => {
  return ({
    _id: v4(),
    message: 'Some message',
  });
};

export const pushNotificationFactory: PartialFactory<any> = partialFactory<any>(pushNotificationDefautFactory);

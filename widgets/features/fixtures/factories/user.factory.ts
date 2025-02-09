import { 
  partialFactory, 
  PartialFactory, 
  DefaultFactory,
} from '@pe/cucumber-sdk';
import { v4 } from 'uuid';

export const defaultUserFactory: DefaultFactory<any> = (): any => ({
  _id: v4(),
  currency: 'EUR',
  installations: [v4(), v4()],
  tutorials: [v4(), v4()],
});

export const userFactory: PartialFactory<any> = partialFactory<any>(defaultUserFactory);

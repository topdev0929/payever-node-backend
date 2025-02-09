import { 
  partialFactory, 
  uniqueString, 
  PartialFactory, 
  DefaultFactory,
} from '@pe/cucumber-sdk';
import { v4 } from 'uuid';

export const defaultBusinessFactory: DefaultFactory<any> = (): any => {
  return ({
    _id: v4(),
    currency: 'EUR',
    installations: [`Installation ${uniqueString}`, `Installation ${uniqueString}`],
    tutorials: [`Tutorial ${uniqueString}`, `Tutorial ${uniqueString}`],
  });
};

export const businessFactory: PartialFactory<any> = partialFactory<any>(defaultBusinessFactory);

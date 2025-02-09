import { DefaultFactory, PartialFactory, partialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';
import { BusinessIntegrationSubInterface } from '../../src/integration/interfaces';

const seq: SequenceGenerator = new SequenceGenerator(1);

type BusinessIntegrationSubType = BusinessIntegrationSubInterface & { _id: string };

const LocalFactory: DefaultFactory<BusinessIntegrationSubType> = (): any => {
  seq.next();

  return {
    _id: uuid.v4(),
    enabled: false,
    installed: false,
  };
};

export class BusinessIntegrationSubFactory {
  public static create: PartialFactory<BusinessIntegrationSubType> =
    partialFactory<BusinessIntegrationSubType>(LocalFactory);
}

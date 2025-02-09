import { partialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import { IntegrationModel } from '../../../src/integration/models';

const seq: SequenceGenerator = new SequenceGenerator();

export const defaultIntegrationFactory: any = (): IntegrationModel => {
  seq.next();

  return ({
    category: `Category_${seq.current}`,
    displayOptions: { },
    name: `Name_${seq.current}`,
  } as any);
};

export const integrationFactory: any = partialFactory(defaultIntegrationFactory);

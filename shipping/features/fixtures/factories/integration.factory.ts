import { partialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import { IntegrationModel } from '../../../src/integration/models';

const seq: SequenceGenerator = new SequenceGenerator();

export const defaultIntegrationFactory: any = (): IntegrationModel => {
  seq.next();

  return ({
    name: `Name_${seq.current}`,
    category: `Category_${seq.current}`,
    displayOptions: {} as any,
  });
};

export const integrationFactory: any = partialFactory(defaultIntegrationFactory);

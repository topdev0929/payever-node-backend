import * as uuid from 'uuid';
import { partialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import { PartialFactory } from '@pe/cucumber-sdk/module/fixtures/helpers/partial-factory';
import {
  IntegrationSubscriptionInterface,
} from '../../src/integration/interfaces';

const defaultFactory: () => any = () => {
  const seq: SequenceGenerator = new SequenceGenerator(0);
  seq.next();

  return {
    _id: '76b88a77-98a9-4258-aa67-43a534f0978a',
    businessId: '2778060b-d3d8-4a4c-be17-368d1f956d3d',
    installed : true,
    integration: '459891bb-78e3-413e-b874-acbdcaef85d6',
    payload: {
      application_sent: true,
      documents: [
        {
          blobName: '0c94e131-f06e-4c6e-9191-422dd4ea9c4d-action_table.pdf',
          fileName: 'action_table.pdf',
          name: 'Company register extract or business registration',
          type: 'commercialRegisterExcerptFilename',
        },
      ],
    },
  };
};

export const IntegrationSubscriptionFactory: PartialFactory<IntegrationSubscriptionInterface> =
  partialFactory(defaultFactory);

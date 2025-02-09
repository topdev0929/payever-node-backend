import { DocumentDefinition } from 'mongoose';
import type { IntegrationModel } from 'src/integration/models';

export const integrationsFixture: Array<DocumentDefinition<IntegrationModel>> = [
  {
    _id: 'f2efd8c4-f3c3-4494-b70a-ba0cc5dc1c4d',
    category: 'communications',
    displayOptions: {
      _id: '93410883-aa31-4886-81e5-3989da104fc7',
      icon: '#icon-communications-qr-white',
      title: 'integrations.communications.qr.title',
    },
    name: 'qr',

    createdAt: new Date('2019-02-26T14:00:00.340+0000'),
    updatedAt: new Date('2019-02-26T14:00:00.340+0000'),

    __v: 0,
  },
  {
    _id: '8e8537a9-c542-4be1-adfc-7563ae5c0d8c',
    category: 'communications',
    displayOptions: {
      _id: '93410883-aa31-4886-81e5-3989da104fc7',
      icon: '#icon-communications-device-payments-white',
      title: 'integrations.communications.device-payments.title',
    },
    name: 'device-payments',

    createdAt: '2019-10-10T15:30:00.000+0000',
    updatedAt: '2019-10-10T15:30:00.000+0000',
  },
  {
    _id: '1ce96be7-77c0-44c1-917d-8237ef0e837f',
    category: 'messaging',
    displayOptions: {
      icon: '#icon-message-email',
      title: 'email',
    },
    name: 'email',

    createdAt: '2021-07-28T00:00:00.000+0000',
    updatedAt: '2021-07-28T00:00:00.000+0000',
  },
];

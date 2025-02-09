import { ApiCallInterface } from '../src/payment-notifications/interfaces';

export const apiCallsFixture:
  Array<ApiCallInterface & { _id: string, createdAt: Date, updatedAt: Date }> = [
  {
    _id: 'b6ae699a-e5c7-40e5-a97e-8de5f20315e2',
    createdAt: new Date(),
    noticeUrl: 'http://test.com/notice',
    updatedAt: new Date(),
  },
];

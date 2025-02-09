import { fixture } from '@pe/cucumber-sdk/module';
import { getModelToken } from '@nestjs/mongoose';

import { IntegrationSubscriptionModel } from '../../../src/integration/models';
import { IntegrationSubscriptionFactory } from '../../factories/integration-subscription-factory';

export = fixture<IntegrationSubscriptionModel>(
  getModelToken('IntegrationSubscription'),
  IntegrationSubscriptionFactory, [
    {
      _id: '76b88a77-98a9-4258-aa67-43a534f0978a',
      businessId: 'd5b25c5c-3684-4ab7-a769-c95f4c0f7546',
      installed: true,
      integration: '06b3464b-9ed2-4952-9cb8-07aac0108a55',
    },
  ],
);

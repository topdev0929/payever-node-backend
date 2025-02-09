import { fixture } from '@pe/cucumber-sdk/module';
import { getModelToken } from '@nestjs/mongoose';

import { IntegrationSubscriptionModel } from '../../../src/integration/models';
import { IntegrationSubscriptionFactory } from '../../factories/integration-subscription-factory';

export = fixture<IntegrationSubscriptionModel>(
  getModelToken('IntegrationSubscription'),
  IntegrationSubscriptionFactory, [
    {
      _id: '76b88a77-98a9-4258-aa67-43a534f0978a',
    },
  ],
);

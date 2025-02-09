import { BusinessIntegrationSubInterface } from '../interfaces';
import { BusinessIntegrationSubModel } from '../models';

export class IntegrationSubOutputConverter {
  public static convert(subscription: BusinessIntegrationSubModel): BusinessIntegrationSubInterface {
    return {
      ...subscription.toObject(),
      integration: {
        ...subscription.integration.toObject(),
      },
    } as BusinessIntegrationSubInterface;
  }
}

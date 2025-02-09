import { IntegrationSubscriptionModel } from '../../../src/integration/models';
import { businessFixture } from './businessFixture';

export class integrationSubscriptionFixture {
  public static getModel(id: string): IntegrationSubscriptionModel {
    const model: IntegrationSubscriptionModel = {
      _id: id,
      id: id,
      save: (): void => { },
    } as IntegrationSubscriptionModel;
    businessFixture.addStubs(model);
    return model;
  }
}

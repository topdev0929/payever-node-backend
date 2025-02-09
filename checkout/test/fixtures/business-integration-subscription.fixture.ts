import { IntegrationSubscriptionModel } from '../../src/integration';
import { StubHelper } from '../bootstrap/stub.helper';

export class BusinessIntegrationSubscriptionFixture {
  public static simple(id: string): IntegrationSubscriptionModel {
    const model: IntegrationSubscriptionModel = {
      id: id,
      save: (): void => {},
    } as IntegrationSubscriptionModel;
    StubHelper.addStubs(model);

    return model;
  }

  public static category(category: string, icon: string = null, title: string= null): IntegrationSubscriptionModel {
    const model: IntegrationSubscriptionModel = {
      installed: true,
      integration: {
        category: category,
        name: category,

        displayOptions: {
          icon: icon,
          id: category,
          title: title,
        },
      },
      save: (): void => {},
    } as IntegrationSubscriptionModel;

    StubHelper.addStubs(model);

    return model;
  }
}

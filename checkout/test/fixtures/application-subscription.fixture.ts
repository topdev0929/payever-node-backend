import { ApplicationSubscriptionModel } from '../../src/application';
import { StubHelper } from '../bootstrap/stub.helper';

export class ApplicationSubscriptionFixture {
  public static simple(
    id:string = null,
    applicationName: string = null,
    applicationId:string = null,
  ): ApplicationSubscriptionModel {
    const model: ApplicationSubscriptionModel = {
      id: id,

      application: {
        id: applicationId,
        name: applicationName,
      },
      save: (): void => {},
    } as ApplicationSubscriptionModel;

    if (!applicationName) {
      model.application = null;
    }

    StubHelper.addStubs(model);

    return model;
  }
}

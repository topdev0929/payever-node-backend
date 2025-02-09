import { ApplicationModel } from '../../src/application';
import { StubHelper } from '../bootstrap/stub.helper';

export class ApplicationFixture {
  public static simple(id: string): ApplicationModel {
    const model: ApplicationModel = {
        id: id,
        save: (): void => {},
    } as ApplicationModel;
    StubHelper.addStubs(model);

    return model;
  }
}

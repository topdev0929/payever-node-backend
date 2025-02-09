import { IntegrationModel } from '../../src/integration';
import { StubHelper } from '../bootstrap/stub.helper';

export class IntegrationFixture {
  public static simple(id: string, name: string, category: string = null): IntegrationModel {
    const model: IntegrationModel = {
      category : category,
      id: id,
      name: name,
      save: (): void => {},
    } as IntegrationModel;
    StubHelper.addStubs(model);

    return model;
  }
}

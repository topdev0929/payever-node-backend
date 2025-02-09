import { IntegrationModel } from '../../../src/integration/models';
import { businessFixture } from './businessFixture';

export class integrationFixture {
  public static getModel(id: string, category: string = null, name: string = 'testName'): IntegrationModel {
    const model: IntegrationModel = {
      _id: id,
      category: category,
      name: name,
      save: (): void => { },
    } as IntegrationModel;
    businessFixture.addStubs(model);
    return model;
  }
}

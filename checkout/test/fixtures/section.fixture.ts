import { SectionModel } from '../../src/checkout';
import { CheckoutSection } from '../../src/integration';
import { StubHelper } from '../bootstrap/stub.helper';

export class SectionFixture {
  public static simple(id: string,code: CheckoutSection = null): SectionModel {
    const model: SectionModel = {
      code: code,
      id: id,
      save: (): void => {},
    } as SectionModel;
    StubHelper.addStubs(model);

    return model;
  }
}

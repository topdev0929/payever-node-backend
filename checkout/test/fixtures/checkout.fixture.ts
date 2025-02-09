import { CheckoutModel } from '../../src/checkout';
import { StubHelper } from '../bootstrap/stub.helper';

export class CheckoutFixture {
  public static simple(checkoutId: string): CheckoutModel {
    const model: CheckoutModel =  {
      _id: checkoutId,
      id: checkoutId,
      settings: {
        languages: [],
      },

      save: (): void => {},
    } as CheckoutModel;

    StubHelper.addStubs(model);

    return model;
  }
}

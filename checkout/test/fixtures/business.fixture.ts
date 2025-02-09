import { BusinessModel } from '../../src/business';
import { ChannelSetModel } from '../../src/channel-set';
import { CheckoutModel } from '../../src/checkout';
import { MyArray } from '../bootstrap/my-array';
import { StubHelper } from '../bootstrap/stub.helper';

export class BusinessFixture {
  public static createChannelSet(isActive: boolean, checkout: CheckoutModel= null): ChannelSetModel {
    const model: ChannelSetModel =  {
      active : isActive,
      checkout: checkout,
    } as ChannelSetModel;
    StubHelper.addStubs(model);

    return model;
  }

  public static simple(businessId: string): BusinessModel {
    const model: BusinessModel =  {
      _id: businessId,
      applicationSubscriptions:[],
      channelSets:[],
      checkouts: [],
      integrationSubscriptions:[],
      save: (): void => {},
    } as BusinessModel;
    StubHelper.addStubs(model);

    return model;
  }

  public static withCheckout(businessId: string, checkoutModel: CheckoutModel): BusinessModel {
    const model: BusinessModel =  {
      _id: businessId,
      checkouts: [checkoutModel],
      save: (): void => {},
    } as BusinessModel;
    StubHelper.addStubs(model);

    return model;
  }

  public static withCheckoutArray(businessId: string, checkoutModels: CheckoutModel[]): BusinessModel {
    const myArray: MyArray<CheckoutModel> = MyArray.create<CheckoutModel>();
    checkoutModels.forEach((x: any) => myArray.push(x));

    const model: BusinessModel =  {
      _id: businessId,
      checkouts: myArray,
      save: (): void => {},
    } as BusinessModel;
    StubHelper.addStubs(model);

    return model;
  }
}

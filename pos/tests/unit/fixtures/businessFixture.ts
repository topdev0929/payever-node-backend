import { Document } from 'mongoose';
import * as sinon from 'sinon';
import { BusinessDto, BusinessModel } from '../../../src/business';

export class businessFixture {
  public static getDTO(): BusinessDto {
    return {
      _id: 'testId',
      name: 'testName',
    } as BusinessDto;
  }
  public static getModel(businessId: string): BusinessModel {
    const model: BusinessModel = {
      _id: businessId,
      id: businessId,
      name: 'testName',
      save: (): void => { },
      channelSets: [],
      integrationSubscriptions: [],
      terminals: [],
    } as BusinessModel;
    this.addStubs(model);

    return model;
  }
  public static getModelWithoutCollectionsAndStubs(businessId: string): BusinessModel {
    return {
      _id: businessId,
      name: 'testName',
      save: (): void => { },
    } as BusinessModel;
  }
  public static addStubs(model: Document): void {
    model.execPopulate = sinon.stub().resolves(model);
    model.populate = sinon.stub().returns(model);
  }
}

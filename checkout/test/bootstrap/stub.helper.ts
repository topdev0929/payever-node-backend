import { Document } from 'mongoose';
import * as sinon from 'sinon';

export class StubHelper {
  public static addStubs(model: Document): void {
    model.execPopulate = sinon.stub().resolves(model);
    model.populate = sinon.stub().returns(model);
  }
}

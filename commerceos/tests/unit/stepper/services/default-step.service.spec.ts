import 'mocha';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { Model } from 'mongoose';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import { SectionsEnum } from '../../../../src/stepper/enums';
import { DefaultStepModel } from '../../../../src/stepper/models';
import { DefaultStepService } from '../../../../src/stepper/services/default-step.service';

chai.use(sinonChai);
chai.use(chaiAsPromised);

const expect: Chai.ExpectStatic = chai.expect;

describe('DefaultStepService', () => {
  let sandbox: sinon.SinonSandbox;
  let defaultStepModel: Model<DefaultStepModel>;
  let testService: DefaultStepService;

  const defaultStepModelInstance: DefaultStepModel = {
    action: 'chooseTheme',
    allowSkip: true,
    order: 1,
    section: SectionsEnum.Builder,
    title: 'steps.shop.create',
  } as any;

  before(() => {
    defaultStepModel = {
      find: (): any => {},
    } as any;

    testService = new DefaultStepService(defaultStepModel);
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    sandbox = undefined;
  });

  describe('getListForSection', () => {
    it('should return a list of defaultStepModel instances with given section', async () => {
      sandbox.stub(defaultStepModel, 'find').resolves([defaultStepModelInstance]);
      const result: DefaultStepModel[] = await testService.getListForSection(SectionsEnum.Builder);
      expect(result).to.deep.equal([defaultStepModelInstance]);
    });
  });
});

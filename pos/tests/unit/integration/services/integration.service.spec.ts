import * as chai from 'chai';
import * as chaisAsPromised from 'chai-as-promised';
import 'mocha';
import * as mongoose from 'mongoose';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import 'sinon-mongoose';
import { IntegrationModel } from '../../../../src/integration/models';

import { IntegrationService } from '../../../../src/integration/services';
import { integrationFixture } from '../../fixtures/integrationFixture';
import { mongooseModelFixture } from '../../fixtures/mongooseModelFixture';

chai.use(sinonChai);
chai.use(chaisAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('IntegrationService', async () => {
  let sandbox: sinon.SinonSandbox;
  let testMock: sinon.SinonMock;

  let model: mongoose.Model<IntegrationModel>;
  let testService: IntegrationService;

  before(async () => {
    model = mongooseModelFixture.getModelMock();
    testService = new IntegrationService(model);
  });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    testMock = sinon.mock(model);
  });

  afterEach(async () => {
    sandbox.restore();
    sandbox = undefined;

    testMock.restore();
  });

  describe('findOneById', () => {
    it('ok', async () => {
      const integrationModel: IntegrationModel = integrationFixture.getModel('sId');

      testMock
        .expects('findOne')
        .withArgs({ _id: integrationModel.id })
        .resolves(integrationModel);

      const result: IntegrationModel = await testService.findOneById(integrationModel.id);

      testMock.verify();
      expect(result).to.be.eq(integrationModel);
    });
  });

  describe('findByCategory', () => {
    it('ok', async () => {
      const category: string = 'cat';
      const integrationModel: IntegrationModel = integrationFixture.getModel('sId');

      testMock
        .expects('find')
        .withArgs({ category: category })
        .resolves([integrationModel]);

      const result: IntegrationModel[] = await testService.findByCategory(category);

      testMock.verify();
      expect(result).length(1);
      expect(result[0]).to.be.eq(integrationModel);
    });

    it('sorting', async () => {
      const category: string = 'cat';
      const integrationModel1: IntegrationModel = integrationFixture.getModel('sId1', category, 'aName');
      const integrationModel2: IntegrationModel = integrationFixture.getModel('sId2', category, 'bName');

      testMock
        .expects('find')
        .withArgs({ category: category })
        .resolves([integrationModel2, integrationModel1]);

      const result: IntegrationModel[] = await testService.findByCategory(category);

      testMock.verify();
      expect(result).length(2);
      expect(result[0]).to.be.eq(integrationModel1);
    });

    it('no subscriptions', async () => {
      const category: string = 'catTest';

      testMock
        .expects('find')
        .withArgs({ category: category })
        .resolves([]);

      const result: IntegrationModel[] = await testService.findByCategory(category);

      testMock.verify();
      expect(result).length(0);
    });
  });

  describe('findAll', () => {
    it('ok', async () => {
      const integrationModel1: IntegrationModel = integrationFixture.getModel('sId1');
      const integrationModel2: IntegrationModel = integrationFixture.getModel('sId2');
      1;
      testMock.expects('find').resolves([integrationModel1, integrationModel2]);

      const result: IntegrationModel[] = await testService.findAll();
      testMock.verify();
      expect(result).length(2);
    });
  });

  describe('findOneByName', () => {
    it('ok', async () => {
      const category: string = 'cat';
      const integrationModel: IntegrationModel = integrationFixture.getModel('sId', category, 'nameToFind');

      testMock
        .expects('findOne')
        .withArgs({ name: integrationModel.name })
        .resolves(integrationModel);

      const result: IntegrationModel = await testService.findOneByName(integrationModel.name);

      testMock.verify();
      expect(result).to.be.eq(integrationModel);
    });
  });
});

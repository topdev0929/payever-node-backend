import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import 'mocha';
import * as mongoose from 'mongoose';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import 'sinon-mongoose';
import { BusinessModel } from '../../../../src/business';
import { IntegrationModel, IntegrationSubscriptionModel } from '../../../../src/integration/models';
import { BusinessIntegrationSubscriptionService } from '../../../../src/integration/services';
import { businessFixture } from '../../fixtures/businessFixture';
import { integrationFixture } from '../../fixtures/integrationFixture';
import { integrationSubscriptionFixture } from '../../fixtures/integrationSubscriptionFixture';

import { mongooseModelFixture } from '../../fixtures/mongooseModelFixture';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

// tslint:disable-next-line:no-big-function
describe('BusinessIntegrationSubscriptionService', async () => {
  let sandbox: sinon.SinonSandbox;

  let model: mongoose.Model<IntegrationSubscriptionModel>;
  let testMock: sinon.SinonMock;

  let testService: BusinessIntegrationSubscriptionService;

  before(async () => {
    model = mongooseModelFixture.getModelMock();
    testService = new BusinessIntegrationSubscriptionService(model);
  });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    testMock = sandbox.mock(model);
  });

  afterEach(async () => {
    sandbox.restore();
    sandbox = undefined;

    testMock.restore();
  });

  describe('install', () => {
    it('Should install business integration', async () => {
      const businessModel: BusinessModel = businessFixture.getModel('bId');
      const integrationModel: IntegrationModel = integrationFixture.getModel('iId');
      const subscriptionModel: IntegrationSubscriptionModel = integrationSubscriptionFixture.getModel('sId');

      testMock
        .expects('create')
        .withArgs({
          installed: false,
          integration: integrationModel,
        })
        .resolves(subscriptionModel);
      testMock
        .expects('findOneAndUpdate')
        .withArgs({ _id: subscriptionModel.id }, { installed: true }, { new: true })
        .resolves(subscriptionModel);

      const result: IntegrationSubscriptionModel = await testService.install(integrationModel, businessModel);

      testMock.verify();
      expect(result).to.be.eq(subscriptionModel);
    });
  });

  describe('uninstall', () => {
    it('ok', async () => {
      const businessModel: BusinessModel = businessFixture.getModel('bId');
      const integrationModel: IntegrationModel = integrationFixture.getModel('iId');
      const subscriptionModel: IntegrationSubscriptionModel = integrationSubscriptionFixture.getModel('sId');

      testMock
        .expects('create')
        .withArgs({
          installed: false,
          integration: integrationModel,
        })
        .resolves(subscriptionModel);
      testMock
        .expects('findOneAndUpdate')
        .withArgs({ _id: subscriptionModel.id }, { installed: false }, { new: true })
        .resolves(subscriptionModel);

      const result: IntegrationSubscriptionModel = await testService.uninstall(integrationModel, businessModel);

      testMock.verify();
      expect(result).to.be.eq(subscriptionModel);
    });
  });

  describe('findOneById', () => {
    it('ok', async () => {
      const subscriptionModel: IntegrationSubscriptionModel = integrationSubscriptionFixture.getModel('sId');

      testMock
        .expects('findById')
        .withArgs(subscriptionModel.id)
        .resolves(subscriptionModel);

      const result: IntegrationSubscriptionModel = await testService.findOneById(subscriptionModel.id);

      testMock.verify();
      expect(result).to.be.eq(subscriptionModel);
    });
  });

  describe('findByCategory', () => {
    it('ok', async () => {
      const category: string = 'catTest';

      const subscriptionModel1: IntegrationSubscriptionModel = integrationSubscriptionFixture.getModel('sId1');
      subscriptionModel1.integration = integrationFixture.getModel('iId1', category);
      const subscriptionModel2: IntegrationSubscriptionModel = integrationSubscriptionFixture.getModel('sId2');
      subscriptionModel2.integration = integrationFixture.getModel('iId2', 'catNoTest');
      const subscriptionModel3: IntegrationSubscriptionModel = integrationSubscriptionFixture.getModel('sId3');
      subscriptionModel3.integration = integrationFixture.getModel('iId3');

      const businessModel: BusinessModel = businessFixture.getModel('bId');
      businessModel.integrationSubscriptions.push(subscriptionModel1);
      businessModel.integrationSubscriptions.push(subscriptionModel2);
      businessModel.integrationSubscriptions.push(subscriptionModel3);

      const result: IntegrationSubscriptionModel[] = await testService.findByCategory(businessModel, category);

      testMock.verify();
      expect(result.length).to.be.eq(1);
      expect(result[0]).to.be.eq(subscriptionModel1);
    });

    it('sorting', async () => {
      const category: string = 'catTest';

      const subscriptionModel1: IntegrationSubscriptionModel = integrationSubscriptionFixture.getModel('sId1');
      subscriptionModel1.integration = integrationFixture.getModel('iId1', category, 'bName');
      const subscriptionModel2: IntegrationSubscriptionModel = integrationSubscriptionFixture.getModel('sId2');
      subscriptionModel2.integration = integrationFixture.getModel('iId2', 'catNoTest');
      const subscriptionModel3: IntegrationSubscriptionModel = integrationSubscriptionFixture.getModel('sId3');
      subscriptionModel3.integration = integrationFixture.getModel('iId3', category, 'aName');

      const businessModel: BusinessModel = businessFixture.getModel('bId');
      businessModel.integrationSubscriptions.push(subscriptionModel1);
      businessModel.integrationSubscriptions.push(subscriptionModel2);
      businessModel.integrationSubscriptions.push(subscriptionModel3);

      const result: IntegrationSubscriptionModel[] = await testService.findByCategory(businessModel, category);

      testMock.verify();
      expect(result.length).to.be.eq(2);
      expect(result[0]).to.be.eq(subscriptionModel3);
    });

    it('no subscriptions', async () => {
      const category: string = 'catTest';

      const businessModel: BusinessModel = businessFixture.getModel('bId');

      const result: IntegrationSubscriptionModel[] = await testService.findByCategory(businessModel, category);

      testMock.verify();
      expect(result.length).to.be.eq(0);
    });
  });

  describe('getSubscriptionsWithIntegrations', () => {
    it('ok', async () => {
      const subscriptionModel1: IntegrationSubscriptionModel = integrationSubscriptionFixture.getModel('sId1');
      const subscriptionModel2: IntegrationSubscriptionModel = integrationSubscriptionFixture.getModel('sId2');
      const subscriptionModel3: IntegrationSubscriptionModel = integrationSubscriptionFixture.getModel('sId3');

      const businessModel: BusinessModel = businessFixture.getModel('bId');
      businessModel.integrationSubscriptions.push(subscriptionModel1);
      businessModel.integrationSubscriptions.push(subscriptionModel2);
      businessModel.integrationSubscriptions.push(subscriptionModel3);

      const result: IntegrationSubscriptionModel[] = await testService.getSubscriptionsWithIntegrations(businessModel);

      expect(result.length).to.be.eq(3);
    });

    it('no subscriptions', async () => {
      const businessModel: BusinessModel = businessFixture.getModel('bId');

      const result: IntegrationSubscriptionModel[] = await testService.getSubscriptionsWithIntegrations(businessModel);

      expect(result.length).to.be.eq(0);
    });
  });

  describe('findOneByIntegrationAndBusiness', () => {
    it('ok', async () => {
      const category: string = 'catTest';

      const subscriptionModel1: IntegrationSubscriptionModel = integrationSubscriptionFixture.getModel('sId1');
      subscriptionModel1.integration = integrationFixture.getModel('iId1', category);
      const subscriptionModel2: IntegrationSubscriptionModel = integrationSubscriptionFixture.getModel('sId2');
      subscriptionModel2.integration = integrationFixture.getModel('iId2', 'catNoTest');
      const subscriptionModel3: IntegrationSubscriptionModel = integrationSubscriptionFixture.getModel('sId3');
      const integration3: IntegrationModel = integrationFixture.getModel('iId3');
      subscriptionModel3.integration = integration3.id;

      const businessModel: BusinessModel = businessFixture.getModel('bId');
      businessModel.integrationSubscriptions.push(subscriptionModel1);
      businessModel.integrationSubscriptions.push(subscriptionModel2);
      businessModel.integrationSubscriptions.push(subscriptionModel3);

      const result: IntegrationSubscriptionModel = await testService.findOneByIntegrationAndBusiness(
        integration3,
        businessModel,
      );

      expect(result).to.be.eq(subscriptionModel3);
    });

    it('no subscriptions', async () => {
      const businessModel: BusinessModel = businessFixture.getModel('bId');
      const integrationModel: IntegrationModel = integrationFixture.getModel('iId3');
      const subscriptionModel: IntegrationSubscriptionModel = integrationSubscriptionFixture.getModel('sId');

      testMock
        .expects('create')
        .withArgs({
          installed: false,
          integration: integrationModel,
        })
        .resolves(subscriptionModel);

      const result: IntegrationSubscriptionModel = await testService.findOneByIntegrationAndBusiness(
        integrationModel,
        businessModel,
      );

      testMock.verify();
      expect(result).to.be.eq(subscriptionModel);
    });
  });

  describe('deleteAllByBusiness', () => {
    it('ok', async () => {
      const subscriptionModel1: IntegrationSubscriptionModel = integrationSubscriptionFixture.getModel('sId1');
      subscriptionModel1.integration = integrationFixture.getModel('iId1', 'category');
      const subscriptionModel2: IntegrationSubscriptionModel = integrationSubscriptionFixture.getModel('sId2');
      subscriptionModel2.integration = integrationFixture.getModel('iId2', 'catNoTest');
      const subscriptionModel3: IntegrationSubscriptionModel = integrationSubscriptionFixture.getModel('sId3');
      subscriptionModel3.integration = integrationFixture.getModel('iId3');

      const businessModel: BusinessModel = businessFixture.getModel('bId');
      businessModel.integrationSubscriptions.push(subscriptionModel1);
      businessModel.integrationSubscriptions.push(subscriptionModel2);
      businessModel.integrationSubscriptions.push(subscriptionModel3);

      testMock.expects('deleteOne').thrice();

      await testService.deleteAllByBusiness(businessModel);
      testMock.verify();
    });
  });
});

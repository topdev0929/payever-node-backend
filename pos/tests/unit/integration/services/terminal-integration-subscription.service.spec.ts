import * as chai from 'chai';
import * as chaisAsPromised from 'chai-as-promised';
import 'mocha';
import * as mongoose from 'mongoose';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import 'sinon-mongoose';
import {
  IntegrationModel,
  IntegrationSubscriptionModel,
  PendingInstallationModel
} from '../../../../src/integration/models';
import { TerminalIntegrationSubscriptionService, IntegrationService } from '../../../../src/integration/services';
import { TerminalModel } from '../../../../src/terminal';
import { integrationFixture } from '../../fixtures/integrationFixture';
import { integrationSubscriptionFixture } from '../../fixtures/integrationSubscriptionFixture';
import { terminalFixture } from '../../fixtures/terminalFixture';

chai.use(sinonChai);
chai.use(chaisAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

// tslint:disable-next-line:no-big-function
describe('TerminalIntegrationSubscriptionService', async () => {
  let sandbox: sinon.SinonSandbox;
  let testMock: sinon.SinonMock;

  let testService: TerminalIntegrationSubscriptionService;

  let subscriptionModel: mongoose.Model<IntegrationSubscriptionModel>;
  let pendingInstallationModel: mongoose.Model<PendingInstallationModel>;
  let integrationService: IntegrationService;

  before(async () => {
    subscriptionModel = {
      findOneAndUpdate(): any { return this; },
      findById(): any { return this; },
      deleteOne(): any { return this; },
      create(): any { return this; },
      populate(): any { return this; },
      execPopulate(): any { return this; },
    } as any;

    pendingInstallationModel = {
      findOne(): any { return this; },
      deleteOne(): any { return this; },
      create(): any { return this; },
    } as any;

    testService = new TerminalIntegrationSubscriptionService(
      subscriptionModel,
      pendingInstallationModel,
      integrationService,
    );
  });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    testMock = sandbox.mock(subscriptionModel);
  });

  afterEach(async () => {
    sandbox.restore();
    sandbox = undefined;

    testMock.restore();
  });

  describe('install', () => {
    it('ok', async () => {
      const terminal: TerminalModel = terminalFixture.getModel('tId');
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

      const result: IntegrationSubscriptionModel = await testService.install(integrationModel, terminal);

      testMock.verify();
      expect(result).to.be.eq(subscriptionModel);
    });
  });

  describe('uninstall', () => {
    it('ok', async () => {
      const terminal: TerminalModel = terminalFixture.getModel('tId');
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

      const result: IntegrationSubscriptionModel = await testService.uninstall(integrationModel, terminal);

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

      const terminal: TerminalModel = terminalFixture.getModel('tId');
      terminal.integrationSubscriptions.push(subscriptionModel1);
      terminal.integrationSubscriptions.push(subscriptionModel2);
      terminal.integrationSubscriptions.push(subscriptionModel3);

      const result: IntegrationSubscriptionModel[] = await testService.findByCategory(terminal, category);

      testMock.verify();
      expect(result).length(1);
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

      const terminal: TerminalModel = terminalFixture.getModel('tId');
      terminal.integrationSubscriptions.push(subscriptionModel1);
      terminal.integrationSubscriptions.push(subscriptionModel2);
      terminal.integrationSubscriptions.push(subscriptionModel3);

      const result: IntegrationSubscriptionModel[] = await testService.findByCategory(terminal, category);

      testMock.verify();
      expect(result).length(2);
      expect(result[0]).to.be.eq(subscriptionModel3);
    });

    it('no subscriptions', async () => {
      const category: string = 'catTest';

      const terminal: TerminalModel = terminalFixture.getModel('tId');

      const result: IntegrationSubscriptionModel[] = await testService.findByCategory(terminal, category);

      testMock.verify();
      expect(result).empty;
    });
  });

  describe('getAllSubscriptions', () => {
    it('ok', async () => {
      const subscriptionModel1: IntegrationSubscriptionModel = integrationSubscriptionFixture.getModel('sId1');
      const subscriptionModel2: IntegrationSubscriptionModel = integrationSubscriptionFixture.getModel('sId2');
      const subscriptionModel3: IntegrationSubscriptionModel = integrationSubscriptionFixture.getModel('sId3');

      const terminal: TerminalModel = terminalFixture.getModel('bId');
      terminal.integrationSubscriptions.push(subscriptionModel1);
      terminal.integrationSubscriptions.push(subscriptionModel2);
      terminal.integrationSubscriptions.push(subscriptionModel3);

      const result: IntegrationSubscriptionModel[] = await testService.getAllSubscriptions(terminal);

      expect(result).length(3);
    });

    it('no subscriptions', async () => {
      const terminal: TerminalModel = terminalFixture.getModel('bId');

      const result: IntegrationSubscriptionModel[] = await testService.getAllSubscriptions(terminal);

      expect(result).empty;
    });
  });

  describe('getInstalledSubscriptions', () => {
    it('ok', async () => {
      const subscriptionModel1: IntegrationSubscriptionModel = integrationSubscriptionFixture.getModel('sId1');
      subscriptionModel1.installed = true;
      const subscriptionModel2: IntegrationSubscriptionModel = integrationSubscriptionFixture.getModel('sId2');
      const subscriptionModel3: IntegrationSubscriptionModel = integrationSubscriptionFixture.getModel('sId3');

      const terminal: TerminalModel = terminalFixture.getModel('bId');
      terminal.integrationSubscriptions.push(subscriptionModel1);
      terminal.integrationSubscriptions.push(subscriptionModel2);
      terminal.integrationSubscriptions.push(subscriptionModel3);

      const result: IntegrationSubscriptionModel[] = await testService.getInstalledSubscriptions(terminal);

      expect(result).length(1);
      expect(result[0]).eq(subscriptionModel1);
    });

    it('no subscriptions', async () => {
      const terminal: TerminalModel = terminalFixture.getModel('bId');
      const result: IntegrationSubscriptionModel[] = await testService.getInstalledSubscriptions(terminal);

      expect(result).empty;
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

      const terminalModel: TerminalModel = terminalFixture.getModel('bId');
      terminalModel.integrationSubscriptions.push(subscriptionModel1);
      terminalModel.integrationSubscriptions.push(subscriptionModel2);
      terminalModel.integrationSubscriptions.push(subscriptionModel3);

      testMock.expects('deleteOne').thrice();

      await testService.deleteAllByTerminal(terminalModel);
      testMock.verify();
    });
  });
});

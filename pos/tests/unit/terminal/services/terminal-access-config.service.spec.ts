import * as chai from 'chai';
import * as chaisAsPromised from 'chai-as-promised';
import 'mocha';
import * as mongoose from 'mongoose';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import 'sinon-mongoose';
import { TerminalAccessConfigModel, TerminalModel } from '../../../../src/terminal/models';
import {
  TerminalAccessConfigService,
} from '../../../../src/terminal/services';
import { mongooseModelFixture } from '../../fixtures/mongooseModelFixture';
import { terminalAccessConfigFixture } from '../../fixtures/terminalAccessConfigFixture';
import { terminalFixture } from '../../fixtures/terminalFixture';

chai.use(sinonChai);
chai.use(chaisAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

// tslint:disable-next-line:no-big-function
describe('TerminalAccessConfigService', async (): Promise<void> => {
  let sandbox: sinon.SinonSandbox;

  let testService: TerminalAccessConfigService;

  let terminalAccessConfigModel: mongoose.Model<TerminalAccessConfigModel>;
  let terminalModel: mongoose.Model<TerminalModel>;

  before(
    async (): Promise<void> => {
      terminalAccessConfigModel = mongooseModelFixture.getModelMock();
      terminalModel = mongooseModelFixture.getModelMock();

      testService = new TerminalAccessConfigService(terminalAccessConfigModel, null);
    },
  );

  beforeEach(
    async (): Promise<void> => {
      sandbox = sinon.createSandbox();
    },
  );

  afterEach(
    async (): Promise<void> => {
      sandbox.restore();
      sandbox = undefined;
    },
  );

  describe('create', (): void => {
    it('ok', async (): Promise<void> => {
      const terminal: TerminalModel = terminalFixture.getModel("tId");

      const updateAccessConfigDTO: any = terminalAccessConfigFixture.getUpdateAccessConfigDTO();
      const terminalAccessConfig: TerminalAccessConfigModel = terminalAccessConfigFixture.getModel(
        'ctId',
        terminal,
      );

      sandbox
        .mock(terminalAccessConfigModel)
        .expects('create')
        .resolves(terminalAccessConfig);

      const result: TerminalAccessConfigModel = await testService.create(terminal, updateAccessConfigDTO);

      expect(result).eq(terminalAccessConfig);

      sandbox.verify();
    });
  });

  describe('findById', (): void => {
    it('ok', async (): Promise<void> => {
      const terminal: TerminalModel = terminalFixture.getModel("tId");
      const terminalAccessConfig: TerminalAccessConfigModel = terminalAccessConfigFixture.getModel(
        'ctId',
        terminal,
      );

      sandbox
        .mock(terminalAccessConfigModel)
        .expects('findOne')
        .withArgs({ _id: terminalAccessConfig.id })
        .resolves(terminalAccessConfig);

      const result: TerminalAccessConfigModel = await testService.findById(terminalAccessConfig.id);
      sandbox.verify();
      expect(result).eq(terminalAccessConfig);
    });
  });

  describe('findByTerminalId', (): void => {
    it('ok', async (): Promise<void> => {
      const terminal: TerminalModel = terminalFixture.getModel("tId");
      const terminalAccessConfig: TerminalAccessConfigModel = terminalAccessConfigFixture.getModel(
        'ctId',
        terminal,
      );

      sandbox
        .mock(terminalAccessConfigModel)
        .expects('findOne')
        .withArgs({ terminal: terminal })
        .resolves(terminalAccessConfig);

      const result: TerminalAccessConfigModel = await testService.findByTerminal(terminal);
      sandbox.verify();
      expect(result).eq(terminalAccessConfig);
    });
  });

  describe('update', (): void => {
    it('ok', async (): Promise<void> => {
      const terminal: TerminalModel = terminalFixture.getModel("tId");

      const updateAccessConfigDTO: any = terminalAccessConfigFixture.getUpdateAccessConfigDTO();
      const terminalAccessConfig: TerminalAccessConfigModel = terminalAccessConfigFixture.getModel(
        'ctId',
        terminal,
      );

      sandbox
        .mock(terminalAccessConfigModel)
        .expects('findOneAndUpdate')
        .resolves(terminalAccessConfig);

      const result: TerminalAccessConfigModel = await testService.update(
        terminal,
        terminalAccessConfig,
        updateAccessConfigDTO,
      );

      expect(result).eq(terminalAccessConfig);

      sandbox.verify();
    });
  });
});

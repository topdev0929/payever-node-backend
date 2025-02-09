import { HttpException } from '@nestjs/common';
import {
  AbstractChannelSetService,
  ChannelEventMessagesProducer,
  ChannelService,
  ChannelSetModel,
} from '@pe/channels-sdk';
import { EventDispatcher } from '@pe/nest-kit';
import * as chai from 'chai';
import * as chaisAsPromised from 'chai-as-promised';
import 'mocha';
import * as mongoose from 'mongoose';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import 'sinon-mongoose';
import { BusinessModel } from '../../../../src/business';
import {
  CreateTerminalDto,
  TerminalAccessConfigService,
  TerminalModel,
  TerminalRabbitEventsProducer,
  TerminalService,
  UpdateTerminalDto,
} from '../../../../src/terminal';
import { TerminalEvent } from '../../../../src/terminal/event-listeners';
import { businessFixture } from '../../fixtures/businessFixture';
import { channelSetFixture } from '../../fixtures/channelSetFixture';
import { mongooseModelFixture } from '../../fixtures/mongooseModelFixture';
import { servicesFixture } from '../../fixtures/servicesFixture';
import { terminalFixture } from '../../fixtures/terminalFixture';

chai.use(sinonChai);
chai.use(chaisAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

// tslint:disable-next-line:no-big-function
describe('TerminalService', async (): Promise<void> => {
  let sandbox: sinon.SinonSandbox;

  let testService: TerminalService;

  let channelService: ChannelService;
  let channelSetService: AbstractChannelSetService;
  let channelEventMessagesProducer: ChannelEventMessagesProducer;
  let terminalEventsProducer: TerminalRabbitEventsProducer;
  let terminalAccessConfigService: TerminalAccessConfigService;
  let eventDispatcher: EventDispatcher;

  let terminalModel: mongoose.Model<TerminalModel>;
  let businessModel: mongoose.Model<BusinessModel>;

  before(
    async (): Promise<void> => {
      channelService = servicesFixture.getChannelService();
      channelSetService = servicesFixture.getAbstractChannelSetService();
      channelEventMessagesProducer = servicesFixture.getChannelEventMessagesProducer();
      terminalEventsProducer = servicesFixture.getTerminalRabbitEventsProducer();
      terminalAccessConfigService = servicesFixture.getTerminalAccessConfigService();
      eventDispatcher = servicesFixture.getEventDispatcher();

      terminalModel = mongooseModelFixture.getModelMock();
      businessModel = mongooseModelFixture.getModelMock();

      testService = new TerminalService(
        terminalModel,
        businessModel,
        channelService,
        channelSetService,
        channelEventMessagesProducer,
        terminalEventsProducer,
        terminalAccessConfigService,
        eventDispatcher,
      );
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
      const terminalDTO: CreateTerminalDto = terminalFixture.getCreateDTO();
      const terminal: TerminalModel = terminalFixture.getModel('tId');
      terminal.active = true;
      const business: BusinessModel = businessFixture.getModel('bId');
      business.terminals.push(terminal);
      const channelSet: ChannelSetModel = channelSetFixture.getModel('bId');

      sandbox
        .mock(channelService)
        .expects('findOneByType')
        .resolves();
      sandbox
        .mock(channelSetService)
        .expects('create')
        .resolves([channelSet]);
      sandbox
        .mock(channelEventMessagesProducer)
        .expects('sendChannelSetNamedByApplication')
        .withArgs(channelSet, terminalDTO.name)
        .resolves();

      sandbox
        .mock(businessModel)
        .expects('findOneAndUpdate')
        .withArgs({ _id: business.id }, { $push: { terminals: terminal } })
        .resolves(business);
      sandbox
        .mock(terminalModel)
        .expects('create')
        .resolves(terminal);
      sandbox
        .mock(terminalModel)
        .expects('findOne')
        .withArgs({ businessId: business._id, active: true })
        .resolves(terminal);
      sandbox
        .mock(terminalEventsProducer)
        .expects('setDefaultTerminalEvent')
        .withArgs(business, terminal)
        .resolves(channelSet);

      const result: TerminalModel = await testService.create(business, terminalDTO);
      expect(result).eq(terminal);

      sandbox.verify();
    });
  });

  describe('removeInBusiness', (): void => {
    it('ok', async (): Promise<void> => {
      const terminal: TerminalModel = terminalFixture.getModel('tId');
      terminal.default = false;
      const business: BusinessModel = businessFixture.getModel('bId');
      business.terminals.push(terminal);
      business.terminals.push(terminalFixture.getModel('tId2'));

      sandbox
        .mock(terminalModel)
        .expects('remove')
        .withArgs({ _id: terminal.id })
        .resolves();
      sandbox
        .mock(businessModel)
        .expects('findOneAndUpdate')
        .withArgs({ _id: business.id }, { $pull: { terminals: terminal } })
        .resolves();
      sandbox
        .mock(eventDispatcher)
        .expects('dispatch')
        .withArgs(TerminalEvent.TerminalRemoved, terminal)
        .resolves();

      await testService.removeInBusiness(business, terminal);
      sandbox.verify();
    });

    it('remove default', async (): Promise<void> => {
      const terminal: TerminalModel = terminalFixture.getModel('tId');
      terminal.default = true;
      const terminalWhichWouldLeft: TerminalModel = terminalFixture.getModel('tId1');
      terminalWhichWouldLeft.default = false;

      const business: BusinessModel = businessFixture.getModel('bId');
      business.terminals.push(terminalWhichWouldLeft);
      business.terminals.push(terminal);

      sandbox
        .mock(terminalEventsProducer)
        .expects('setDefaultTerminalEvent')
        .withArgs(business, terminalWhichWouldLeft)
        .resolves();
      sandbox
        .mock(terminalModel)
        .expects('remove')
        .withArgs({ _id: terminal.id })
        .resolves();
      sandbox
        .mock(businessModel)
        .expects('findOneAndUpdate')
        .withArgs({ _id: business.id }, { $pull: { terminals: terminal } })
        .resolves();
      sandbox
        .mock(eventDispatcher)
        .expects('dispatch')
        .withArgs(TerminalEvent.TerminalRemoved, terminal)
        .resolves();

      await testService.removeInBusiness(business, terminal);
      sandbox.verify();
      expect(terminalWhichWouldLeft.default).to.be.true;
    });

    it('cannot delete last terminal', async (): Promise<void> => {
      const terminal: TerminalModel = terminalFixture.getModel('tId');
      const business: BusinessModel = businessFixture.getModel('bId');
      business.terminals.push(terminal);

      await expect(testService.removeInBusiness(business, terminal)).to.be.eventually.rejectedWith(
        HttpException,
        'Can not delete last terminal',
      );
      sandbox.verify();
    });

    it('no terminals', async (): Promise<void> => {
      const terminal: TerminalModel = terminalFixture.getModel('tId');
      const business: BusinessModel = businessFixture.getModel('bId');

      await expect(testService.removeInBusiness(business, terminal)).to.be.eventually.rejectedWith(
        HttpException,
        'Can not delete last terminal',
      );
      sandbox.verify();
    });
  });

  describe('removeById', (): void => {
    it('ok', async (): Promise<void> => {
      const terminal: TerminalModel = terminalFixture.getModel('tId');
      terminal.default = false;

      sandbox
        .mock(terminalModel)
        .expects('findByIdAndRemove')
        .withArgs({ _id: terminal.id })
        .resolves(terminal);
      sandbox
        .mock(eventDispatcher)
        .expects('dispatch')
        .withArgs(TerminalEvent.TerminalRemoved, terminal)
        .resolves();

      await testService.removeById(terminal.id);
      sandbox.verify();
    });
  });

  describe('findAllByBusiness', (): void => {
    it('ok', async (): Promise<void> => {
      const terminal: TerminalModel = terminalFixture.getModel('tId');
      const business: BusinessModel = businessFixture.getModel('bId');
      business.terminals.push(terminal);
      business.terminals.push(terminalFixture.getModel('tId2'));

      const result: TerminalModel[] = await testService.findAllByBusiness(business);
      sandbox.verify();
      expect(result).eq(business.terminals);
    });
  });

  describe('update', (): void => {
    it('ok', async (): Promise<void> => {
      const updateDto: UpdateTerminalDto = terminalFixture.getUpdateDTO();
      const terminal: TerminalModel = terminalFixture.getModel('tId');
      const terminalUpdated: TerminalModel = terminalFixture.getModel('tIdU');
      terminalUpdated.business = businessFixture.getModel('bId');

      sandbox
        .mock(terminalModel)
        .expects('findOne')
        .withArgs({ _id: terminal.id })
        .returns(terminal);
      sandbox
        .mock(terminalModel)
        .expects('findOneAndUpdate')
        .withArgs({ _id: terminal.id }, { $set: updateDto }, { new: true })
        .resolves(terminalUpdated);

      sandbox
        .mock(channelEventMessagesProducer)
        .expects('sendChannelSetNamedByApplication')
        .withArgs(terminal.channelSet, updateDto.name)
        .resolves();
      sandbox
        .mock(terminalEventsProducer)
        .expects('setDefaultTerminalEvent')
        .withArgs(terminal.business, terminalUpdated)
        .resolves();
      sandbox
        .mock(eventDispatcher)
        .expects('dispatch')
        .withArgs(TerminalEvent.TerminalUpdated, terminal, terminalUpdated)
        .resolves();

      const result: TerminalModel = await testService.update(terminal, updateDto);
      sandbox.verify();
      expect(result).to.be.eq(terminalUpdated);
    });
  });

  describe('isNameAvailable', (): void => {
    it('same name', async (): Promise<void> => {
      const nameCheck: string = 'terminalName';
      const terminal: TerminalModel = terminalFixture.getModel('tId', '', nameCheck);
      const business: BusinessModel = businessFixture.getModel('bId');

      sandbox
        .mock(terminalModel)
        .expects('findOne')
        .withArgs({
          businessId: business._id,
          name: nameCheck,
        })
        .resolves(terminal);

      const result: boolean = await testService.isNameAvailable(business, nameCheck);
      sandbox.verify();
      expect(result).to.be.false;
    });
    it('same name, same terminal', async (): Promise<void> => {
      const nameCheck: string = 'terminalName';
      const terminal: TerminalModel = terminalFixture.getModel('tId', '', nameCheck);
      const business: BusinessModel = businessFixture.getModel('bId');

      sandbox
        .mock(terminalModel)
        .expects('findOne')
        .withArgs({
          businessId: business._id,
          name: nameCheck,
        })
        .resolves(terminal);

      const result: boolean = await testService.isNameAvailable(business, nameCheck, terminal);
      sandbox.verify();
      expect(result).to.be.true;
    });

    it('no such name', async (): Promise<void> => {
      const nameCheck: string = 'terminalName';
      const business: BusinessModel = businessFixture.getModel('bId');

      sandbox
        .mock(terminalModel)
        .expects('findOne')
        .withArgs({
          businessId: business._id,
          name: nameCheck,
        })
        .resolves();

      const result: boolean = await testService.isNameAvailable(business, nameCheck);
      sandbox.verify();
      expect(result).to.be.true;
    });
  });

  describe('setActive', (): void => {
    it('ok', async (): Promise<void> => {
      const terminal: TerminalModel = terminalFixture.getModel('tId');
      const business: BusinessModel = businessFixture.getModel('bId');
      terminal.business = business;
      business.terminals.push(terminal);
      const secondTerminal: TerminalModel = terminalFixture.getModel('tId2');
      business.terminals.push(secondTerminal);

      sandbox
        .mock(terminalEventsProducer)
        .expects('setDefaultTerminalEvent')
        .withArgs(business, terminal)
        .resolves();

      await testService.setActive(business, terminal);
      sandbox.verify();
      expect(terminal.active).to.be.true;
      expect(secondTerminal.active).to.be.false;
    });
  });

  describe('getActive', (): void => {
    it('ok', async (): Promise<void> => {
      const terminal: TerminalModel = terminalFixture.getModel('tId');
      terminal.active = true;
      const business: BusinessModel = businessFixture.getModel('bId');
      terminal.business = business;
      business.terminals.push(terminal);
      const secondTerminal: TerminalModel = terminalFixture.getModel('tId2');
      business.terminals.push(secondTerminal);

      sandbox
        .mock(terminalModel)
        .expects('findOne')
        .withArgs({ businessId: 'bId', active: true })
        .resolves(terminal);

      const active: TerminalModel = await testService.getActive(business);
      sandbox.verify();
      expect(active).to.be.eq(terminal);
    });
  });

  describe('getList', (): void => {
    it('same name', async (): Promise<void> => {
      const query: string = 'aaaa';
      const limit: number = 5;
      const skip: number = 5;
      const terminal: TerminalModel = terminalFixture.getModel('tId');

      const mock: sinon.SinonMock = sandbox.mock(terminalModel);
      mock
        .expects('find')
        .withArgs(query)
        .returns(
          {
            limit: sinon.stub().withArgs(limit).returnsThis(),
            populate: sinon.stub().returns([terminal]),
            skip: sinon.stub().withArgs(skip).returnsThis(),
          },
        );

      const result: TerminalModel[] = await testService.getList(query, limit, skip);

      sandbox.verify();
      expect(result).length(1);
      expect(result[0]).to.be.eq(terminal);
    });
  });
});

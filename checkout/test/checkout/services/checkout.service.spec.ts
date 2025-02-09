import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { LanguageService } from '@pe/common-sdk';
import { NestEventEmitter } from '@pe/nest-kit';
import { NEST_EVENT_EMITTER } from '@pe/nest-kit/modules/event-emitter/constants';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import 'mocha';
import * as mongoose from 'mongoose';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import 'sinon-mongoose';
import {
  CheckoutIntegrationSubscriptionService,
  CheckoutService,
  SectionsService,
} from '../../../src/checkout/services';
import { BusinessFixture } from '../../../test/unit/business.fixture';
import { CheckoutFixture } from '../../../test/unit/checkouts.fixture';
import {
  BubbleInterface,
  BusinessSchema,
  BusinessSchemaName,
  ChannelSettingsInterface,
  CheckoutModel,
  CheckoutSchema,
  CheckoutSchemaName,
  CheckoutSettingsInterface,
  CreateCheckoutDto,
  SectionDto,
  SectionEnum,
  UpdateCheckoutDto,
} from '../../integration';
import { CheckoutEvent } from '../enums';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('CheckoutService ', async () => {
  let sandbox: sinon.SinonSandbox;

  let checkoutIntegrationSubscriptionService: CheckoutIntegrationSubscriptionService;
  let checkoutService: CheckoutService;

  let checkoutFixture: CheckoutFixture;
  let businessFixture: BusinessFixture;

  let serviceCheckoutModel: CheckoutModel;
  let emitter: NestEventEmitter;

  let checkoutMock: sinon.SinonMock & mongoose.Model<CheckoutModel>;

  before(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [

        CheckoutService,
        {
          provide: getModelToken(CheckoutSchemaName),
          useValue: mongoose.model(CheckoutSchemaName, CheckoutSchema)
        },
        {
          provide: getModelToken(BusinessSchemaName),
          useValue: mongoose.model(BusinessSchemaName, BusinessSchema)
        },
        {
          provide: NEST_EVENT_EMITTER,
          useValue: {
            emit: (): void => {},
          },
        },
        {
          provide: LanguageService,
          useValue: {
            getLanguage: () => { '' }
          }
        },
        {
          provide: CheckoutIntegrationSubscriptionService,
          useValue: {
            deleteOneById:(): void => {}
          }
        },
        {
          provide: SectionsService,
          useValue: {
            getDefaultSections: () => { '' }
          }
        },

      ]
    }).compile();

    emitter = module.get<NestEventEmitter>(NEST_EVENT_EMITTER);

    checkoutIntegrationSubscriptionService=module.get<CheckoutIntegrationSubscriptionService>(CheckoutIntegrationSubscriptionService);
    checkoutService = module.get<CheckoutService>(CheckoutService);

    serviceCheckoutModel = module.get(getModelToken(CheckoutSchemaName));

    checkoutFixture = new CheckoutFixture();
    businessFixture = new BusinessFixture();
  });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    checkoutMock = sinon.mock(serviceCheckoutModel) as sinon.SinonMock & mongoose.Model<CheckoutModel>;
  });

  afterEach(async () => {
    sandbox.restore();
    checkoutMock.restore();
    sandbox = undefined;
  });

  describe('findOneById', () => {
    it('found', async () => {
      const id = 'id1';

      checkoutMock
        .expects('findById')
        .withArgs(id)
        .resolves();

      await checkoutService.findOneById(id);
      expect(checkoutMock.verify());
    });
  });

  describe('findAllByBusiness', () => {
    it('found', async () => {
      const id = 'id1';
      const model = businessFixture.simple(id);

      checkoutMock
        .expects('find')
        .withArgs({ businessId: id })
        .resolves();

      await checkoutService.findAllByBusiness(model);
      expect(checkoutMock.verify());
    });
  });

  describe('findMany', () => {
    it('found', async () => {
      const offset = 10;
      const limit = 20;

      checkoutMock.
        expects('find')
        .chain('skip')
        .withArgs(offset)
        .chain('limit')
        .withArgs(limit)
        .resolves();

      await checkoutService.findMany(offset, limit);
      expect(checkoutMock.verify());
    });
  });

  describe('countCheckouts', () => {

    it('count', async () => {
      checkoutMock.
        expects('count')
        .resolves();

      await checkoutService.countCheckouts();
      expect(checkoutMock.verify());
    });
  });

  describe('createDefault', () => {

    it('create', async () => {
      const checkoutId = 'id2';
      const language = 'en';

      const id = 'id1';
      const model = businessFixture.simple(id);

      sandbox.stub(emitter, 'emit').resolves();
      // We dont need languages check for now.
      sandbox.stub(checkoutService, <any>'getDefaultLanguages');

      checkoutMock
        .expects('create')
        .resolves();

      const created: CheckoutModel = await checkoutService.createDefault(model, checkoutId, language);

      expect(checkoutMock.verify());
      expect(emitter.emit).to.have.been.calledOnceWith(CheckoutEvent.CheckoutCreated, created);
      expect(model.checkouts).be.not.empty;
    });
  });

  describe('createBasedOnDefault', () => {

    it('no name - default is called', async () => {
      const id = 'id1';
      const model = businessFixture.simple(id);
      const createDTO = { } as CreateCheckoutDto;

      sandbox.stub(checkoutService, 'createDefault').resolves();

      const created: CheckoutModel = await checkoutService.createBasedOnDefault(model, createDTO);

      expect(checkoutService.createBasedOnDefault).to.not.throw;
      expect(checkoutService.createDefault).to.have.been.calledOnce;
    });

    it('has name - created but default isn't called', async () => {
      const createDTO = { name : 'test', sections : [] } as CreateCheckoutDto;

      const id = 'id1';
      const model = businessFixture.simple(id);

      checkoutMock
      .expects('create')
      .resolves();

      sandbox.stub(emitter, 'emit').resolves();
      // We dont need languages check for now.
      sandbox.stub(checkoutService, <any>'getDefaultLanguages');
      sandbox.stub(checkoutService, 'createDefault').resolves();
      sandbox.stub(checkoutService, 'findDefaultForBusiness').resolves();

      const created: CheckoutModel = await checkoutService.createBasedOnDefault(model, createDTO);

      expect(checkoutMock.verify());
      expect(emitter.emit).to.have.been.calledOnceWith(CheckoutEvent.CheckoutCreated, created);
      expect(model.checkouts).be.not.empty;
      expect(checkoutService.createDefault).to.have.not.been.calledOnce;
    });

    // TODO - check create logic
  });

  describe('update', () => {
    it('update', async () => {

      const data = {
        name : 'update'
      }  as UpdateCheckoutDto;

      const id = 'id1';
      const checkout = checkoutFixture.simple(id);

      checkoutMock
        .expects('findOneAndUpdate')
        .withArgs({ _id: id }, { $set: data }, { new: true })
        .resolves();

      sandbox.stub(emitter, 'emit').resolves();

      const result = await checkoutService.update(checkout, data);

      expect(checkoutMock.verify());
      expect(emitter.emit).to.have.been.calledOnceWith(CheckoutEvent.CheckoutUpdated, checkout, result);
    });
  });

  describe('updateChannelSettings', () => {
    it('update', async () => {
      const bubbleData = {
        visibility: true
      } as BubbleInterface;
      const data = {
        bubble : bubbleData
      }  as ChannelSettingsInterface;

      const id = 'id1';
      const checkout = checkoutFixture.simple(id);

      checkoutMock
        .expects('update')
        .withArgs({ _id: id }, { $set: { 'channelSettings': data } })
        .resolves();

      const result = await checkoutService.updateChannelSettings(checkout, data);

      expect(checkoutMock.verify());
    });
  });

  describe('updateSettings', () => {
    it('update', async () => {
      const data = {
        testingMode : true
      }  as CheckoutSettingsInterface;

      const id = 'id1';
      const checkout = checkoutFixture.simple(id);

      checkoutMock
        .expects('update')
        .withArgs({ _id: id }, { $set: { 'settings': data } })
        .resolves();

      const result = await checkoutService.updateSettings(checkout, data);

      expect(checkoutMock.verify());
    });
  });

  describe('updateSections', () => {
    it('update', async () => {

      const data = {
        name : SectionEnum.Address
      }  as SectionDto;

      const id = 'id1';
      const checkout = checkoutFixture.simple(id);

      checkoutMock
        .expects('update')
        .withArgs({ _id: id }, { $set: { 'sections': [data ]} })
        .resolves();

      const result = await checkoutService.updateSections(checkout, [data]);

      expect(checkoutMock.verify());
    });
  });

  describe('findDefaultForBusiness', () => {
    it('find', async () => {
      const id = 'id1';
      const business = businessFixture.simple(id);

      checkoutMock
        .expects('findOne')
        .withArgs({ businessId: id, default: true})
        .resolves();

      const result = await checkoutService.findDefaultForBusiness(business);

      expect(checkoutMock.verify());
    });
  });

  describe('remove', () => {
    it('no checkouts', async () => {
      const id1 = 'id1';
      const id2 = 'id2';
      const checkoutModel = checkoutFixture.simple(id1);
      const businessModel = businessFixture.simple(id2);

      expect(
        checkoutService.remove(
          checkoutModel,
          businessModel
        )
      ).to.be.eventually.rejectedWith(
        Error,
        `It is not allowed to delete last checkout`
      );
    });

   it('remove', async () => {
      const id1 = '1';
      const id2 = '2';
      const collection = new Array<CheckoutModel>();
      collection.push(checkoutFixture.simple(id1));
      collection.push(checkoutFixture.simple(id2));
      const business = businessFixture.withCheckoutArray(id2, collection);

      sandbox.stub(checkoutIntegrationSubscriptionService, 'deleteOneById').resolves();

      checkoutMock
        .expects('remove')
        .withArgs({ _id:collection[0].id})
        .resolves();
      sandbox.stub(emitter, 'emit').resolves();

      await checkoutService.remove(collection[0], business);

      expect(checkoutMock.verify());
      expect(emitter.emit).to.have.been.calledOnceWith(CheckoutEvent.CheckoutRemoved, collection[0]);
    });
  });

  describe('setDefault', () => {

    it('set', async () => {
      const checkout = checkoutFixture.simple( 'id2');
      const business = businessFixture.withCheckout('id1', checkout);

      sandbox.stub(checkoutIntegrationSubscriptionService, 'deleteOneById').resolves();

      checkoutMock
        .expects('find')
        .withArgs({ businessId: business._id})
        .resolves([]);

      await checkoutService.setDefault(checkout, business);
      expect(checkoutMock.verify());
      expect(checkout.default).to.be.true;
    });
  });

  describe('getList', () => {
    it('found', async () => {
      const offset = 10;
      const limit = 20;
      const query = 'query';

      checkoutMock.
        expects('find')
        .withArgs(query)
        .chain('limit')
        .withArgs(offset)
        .chain('skip')
        .withArgs(limit)
        .resolves();

      await checkoutService.getList(query, offset, limit);
      expect(checkoutMock.verify());
    });
  });

  describe('deleteOneById', () => {
    it('delete', async () => {
      const checkoutId = 'id2';
      const checkout = checkoutFixture.simple(checkoutId);

      checkoutMock.
        expects('deleteOne')
        .withArgs({ _id: checkoutId})
        .resolves();

      await checkoutService.deleteOneById(checkout);
      expect(checkoutMock.verify());
      // TODO - verify that subscriptions also has been deleted.
    });
  });
});

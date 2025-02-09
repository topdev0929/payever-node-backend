import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import 'mocha';
import * as mongoose from 'mongoose';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import 'sinon-mongoose';
import { CheckoutService, ValidationService } from '../../../src/checkout/services';
import { BusinessFixture } from '../../../test/unit/business.fixture';
import { CheckoutFixture } from '../../../test/unit/checkouts.fixture';
import { IntegrationsFixture } from '../../../test/unit/integrations.fixture';
import {
  BusinessSchema,
  BusinessSchemaName,
  BusinessService,
  CheckoutModel,
  CheckoutSchema,
  CheckoutSchemaName,
  IntegrationSchema,
  IntegrationSchemaName,
} from '../../integration';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('ValidationService ', async () => {
  let sandbox: sinon.SinonSandbox;
  let validationService: ValidationService;
  let businessService: BusinessService;
  let checkoutService: CheckoutService;
  let checkoutModel: CheckoutModel;

  let checkoutMock: sinon.SinonMock & mongoose.Model<CheckoutModel>;

  let integrationFixture: IntegrationsFixture;
  let businessFixture: BusinessFixture;
  let checkoutFixture: CheckoutFixture;

  before(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CheckoutService,
          useValue: {
            findOneById: () => { }
          }
        },
        {
          provide: BusinessService,
          useValue: {
            findOneById: () => { }
          }
        },
        {
          provide: getModelToken(CheckoutSchemaName),
          useValue: mongoose.model(CheckoutSchemaName, CheckoutSchema)
        },
        {
          provide: getModelToken(BusinessSchemaName),
          useValue: mongoose.model(BusinessSchemaName, BusinessSchema)
        },
        {
          provide: getModelToken(IntegrationSchemaName),
          useValue: mongoose.model(IntegrationSchemaName, IntegrationSchema)
        }
      ]
    }).compile();

    businessService = module.get<BusinessService>(BusinessService);
    checkoutService = module.get<CheckoutService>(CheckoutService);
    checkoutModel = module.get(getModelToken(CheckoutSchemaName));

    validationService = new ValidationService(
      module.get(getModelToken(CheckoutSchemaName)),
      checkoutService,
      businessService
    );

    integrationFixture = new IntegrationsFixture();
    businessFixture = new BusinessFixture();
    checkoutFixture = new CheckoutFixture();
  });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    checkoutMock = sinon.mock(checkoutModel) as sinon.SinonMock & mongoose.Model<CheckoutModel>;
  });

  afterEach(async () => {
    sandbox.restore();
    checkoutMock.restore();
    sandbox = undefined;
  });

  describe('validateIntegrationBelongsToBusiness', () => {
    it('no integrations', async () => {

      const name:string = 'name';
      const model = integrationFixture.simple('1',name);
      const businessModel = businessFixture.simple(name);
      businessModel.populate = sinon.stub().resolves();

      expect(
        validationService.validateIntegrationBelongsToBusiness(
          model,
          businessModel
        )
      ).to.be.eventually.rejectedWith(
        Error,
        `Integration '${model.name}' doesn't belong business '${businessModel.id}'`
      );
    });

    it('integration doesnt belongs to business', async () => {
      const businessId = 'id1';
      const businessModel = businessFixture.simple(businessId);

      const integration1Model = integrationFixture.simple('1','a');
      const integration2Model = integrationFixture.simple('2','b');

      let integrations = [];
      integrations.push(integration2Model);
      sandbox
        .stub(businessModel, 'integrationSubscriptions')
        .value(integrations);

      expect(
        validationService.validateIntegrationBelongsToBusiness(
          integration1Model,
          businessModel
        )
      ).to.be.eventually.rejectedWith(
        Error,
        `Integration '${integration1Model.name}' doesn't belong business '${businessModel.id}'`
      );
    });

    it('ok', async () => {
      const businessId = 'id1';
      const businessModel = businessFixture.simple(businessId);

      const integration1Model = integrationFixture.simple('1','a');
      const integration2Model = integrationFixture.simple('2','b');

      let integrations = [];
      integrations.push({integration : integration2Model.id});
      integrations.push({integration : integration1Model.id});
      sandbox
        .stub(businessModel, 'integrationSubscriptions')
        .value(integrations);

      expect(
        function(){
          validationService.validateIntegrationBelongsToBusiness(
            integration1Model,
            businessModel
          )
        }
      ).to.not.throw();
    });
  });

  describe('getBusiness', () => {
    it('empty businessService ', async () => {
      const businessId = 'id1';

      await expect(
        validationService.getBusiness(businessId)
      ).to.be.eventually.rejectedWith(
        Error,
        `Business with id '${businessId}' not found`
      );
    });

    it('find business by id ', async () => {
      const businessId = 'id1';
      const model = businessFixture.simple(businessId);

      sandbox.stub(businessService, 'findOneById').resolves(model);

      const found = await validationService.getBusiness(businessId);
      expect(businessService.findOneById).to.have.been.calledOnceWith(
        businessId
      );
      expect(found).to.be.eq(model);

    });
  });

  describe('getCheckoutAndBusiness', () => {
    it('empty checkoutService ', async () => {
      const checkoutId = 'id2';
      const businessId = 'id1';

      await expect(
        validationService.getCheckoutAndBusiness(checkoutId, businessId)
      ).to.be.eventually.rejectedWith(
        Error,
        `Checkout with id '${checkoutId}' not found'`
      );
    });

    it('different checkout and business', async () => {
      const checkoutId = 'id2';
      const businessId = 'id1';
      const checkout = checkoutFixture.simple(checkoutId);
      checkout.name = 'name';
      const businessModel = businessFixture.simple(businessId);

      sandbox.stub(checkoutService, 'findOneById').resolves(checkout);
      sandbox.stub(businessService, 'findOneById').resolves(businessModel);

       await expect(
         validationService.getCheckoutAndBusiness(checkoutId, businessId)
       ).to.be.eventually.rejectedWith(
         Error,
         `Checkout id '${checkoutId}' doesn't belong business with id '${businessId}'`
       );

      expect(businessService.findOneById).to.have.been.calledOnceWith(
        businessId
      );
      expect(checkoutService.findOneById).to.have.been.calledOnceWith(
        checkoutId
      );
    });

    it('good', async () => {
      const checkoutId = 'id2';
      const businessId = 'id1';
      const checkout = checkoutFixture.simple(checkoutId);
      checkout.name = 'name';
      const businessModel = businessFixture.withCheckout(businessId, checkout);

      sandbox.stub(checkoutService, 'findOneById').resolves(checkout);
      sandbox.stub(businessService, 'findOneById').resolves(businessModel);

      const result = await validationService.getCheckoutAndBusiness(checkoutId, businessId);

      expect(businessService.findOneById).to.have.been.calledOnceWith( businessId);
      expect(checkoutService.findOneById).to.have.been.calledOnceWith(      checkoutId);
      expect(result[0]).to.be.eq(checkout);
      expect(result[1]).to.be.eq(businessModel);

    });

  });

  describe('validateSettingsPhone', () => {
    it('phone without id ', async () => {
      const phone = 'phone1';

      checkoutMock
        .expects('findOne')
        .withArgs({ 'settings.phoneNumber': phone })
        .resolves();

      await validationService.validateSettingsPhone(phone);
      expect(checkoutMock.verify());
    });

    it('phone and id ', async () => {
      const phone = 'phone1';
      const id = 'id1';

      checkoutMock
        .expects('findOne')
        .withArgs({ _id: { $ne: id }, 'settings.phoneNumber': phone })
        .resolves();

      await validationService.validateSettingsPhone(phone, id);
      expect(checkoutMock.verify());
    });
  });

  describe('validateCheckoutName', () => {
    it('no such checkout', async () => {
      const businessModel = businessFixture.simple('1');
      const name = 'chekc1';

      const result = await validationService.validateCheckoutName(businessModel, name);
      expect(checkoutMock.verify());
      expect(result).to.be.true;
    });

    it('valid', async () => {
      const checkout = checkoutFixture.simple('id2');
      checkout.name = 'name';
      const businessModel = businessFixture.withCheckout('id1', checkout);

      const result = await validationService.validateCheckoutName(businessModel, checkout.name);
      expect(checkoutMock.verify());
      expect(result).to.be.false;
    });
  });

});

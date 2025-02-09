import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'mocha';
import * as mongoose from 'mongoose';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';
import 'sinon-mongoose';
import { EditBusinessDto as BusinessDto } from '../../../../src/business/';
import { BusinessService, BusinessModel } from '@pe/business-kit';
import { businessFixture } from '../../fixtures/businessFixture';
import { mongooseModelFixture } from '../../fixtures/mongooseModelFixture';
import { EventDispatcher } from '@pe/nest-kit';
import { servicesFixture } from '../../fixtures/servicesFixture';



chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('BusinessService', async () => {
  let sandbox: sinon.SinonSandbox;
  let businessMock: sinon.SinonMock;

  let businessModel: mongoose.Model<BusinessModel>;
  let testService: BusinessService;
  let eventDispatcher: EventDispatcher;

  before(async () => {
    businessModel = mongooseModelFixture.getModelMock();
    eventDispatcher = eventDispatcher = servicesFixture.getEventDispatcher();
    testService = new BusinessService(businessModel, eventDispatcher);
  });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    businessMock = sandbox.mock(businessModel);
  });

  afterEach(async () => {
    sandbox.restore();
    sandbox = undefined;

    businessMock.restore();
  });

  describe('findOneById', () => {
    it('ok', async () => {
      const id: string = 'testId';

      businessMock
        .expects('findOne')
        .withArgs({ _id: id })
        .resolves({});

      await testService.findOneById(id);

      businessMock.verify();
    });
  });

  describe('deleteOneById', () => {
    it('ok', async () => {
      const id: string = 'testId';

      const stub: BusinessModel = businessFixture.getModel(id);
      sandbox.stub(businessModel, 'findByIdAndRemove').resolves(stub)
      const result: BusinessModel = await testService.deleteOneById(id);

      businessMock.verify();
      expect(result).to.be.eq(stub);
    });
  });

  describe('updateById', () => {
    it('ok', async () => {
      const dto: BusinessDto = businessFixture.getDTO();

      sandbox.stub(businessModel, 'findByIdAndUpdate').resolves()
      sandbox.stub(businessModel, 'update').resolves()

      await testService.updateById(dto._id, dto);

      businessMock.verify();
    });
  });
});

import * as chai from 'chai';
import * as chaisAsPromised from 'chai-as-promised';
import 'mocha';
import * as mongoose from 'mongoose';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import 'sinon-mongoose';

import { EventDispatcher } from '@pe/nest-kit';
import { BusinessService } from '@pe/business-kit';
import { BusinessDto, BusinessModel } from '../../../../src/business';
import { businessFixture } from '../../fixtures/businessFixture';
import { servicesFixture } from '../../fixtures/servicesFixture';
import { mongooseModelFixture } from '../../fixtures/mongooseModelFixture';

chai.use(sinonChai);
chai.use(chaisAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('BusinessService', async () => {
  let sandbox: sinon.SinonSandbox;
  let businessMock: sinon.SinonMock;

  let businessModel: mongoose.Model<BusinessModel>;
  let testService: BusinessService;
  let eventDispatcher: EventDispatcher;

  before(async () => {
    businessModel = mongooseModelFixture.getModelMock();
    eventDispatcher = servicesFixture.getEventDispatcher();
    testService = new BusinessService(businessModel as any, eventDispatcher);
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

  describe('create', () => {
    it('Should create business', async () => {
      const dto: BusinessDto = businessFixture.getDTO();

      businessMock
        .expects('findByIdAndUpdate')
        .withArgs(dto._id)
        .resolves({
          lastErrorObject: {
            updatedExisting: false,
          },
          value: dto,
        });

      const result: BusinessModel = await testService.create(dto) as BusinessModel;

      businessMock.verify();
      expect(result).to.be.eq(dto);
    });
  });

  describe('findOneById', () => {
    it('Find business by id', async () => {
      const dto: BusinessDto = businessFixture.getDTO();
      const id: string = 'testId';

      businessMock
        .expects('findOne')
        .withArgs({ _id: id })
        .resolves(dto);

      const result: BusinessModel = await testService.findOneById(id) as BusinessModel;

      businessMock.verify();
      expect(result).to.be.eq(dto);
    });
  });

  describe('deleteOneById', () => {
    it('Delete business by id', async () => {
      const id: string = 'testId';

      const stub: BusinessModel = businessFixture.getModel(id);
      businessMock
        .expects('findByIdAndRemove')
        .withArgs(id)
        .resolves(stub);

      const result: BusinessModel = await testService.deleteOneById(id) as BusinessModel;

      businessMock.verify();
      expect(result).to.be.eq(stub);
    });
  });

  describe('updateById', () => {
    it('Update business by id', async () => {
      const dto: BusinessDto = businessFixture.getDTO();

      businessMock
        .expects('findByIdAndUpdate')
        .withArgs(dto._id, { $set: dto }, { new: true, upsert: true })
        .resolves(dto);

      const result: BusinessModel = await testService.updateById(dto._id, dto) as BusinessModel;
      expect(result).to.be.eq(dto);

      businessMock.verify();
    });
  });
});

import 'mocha';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as uuid from 'uuid';
import { Model } from 'mongoose';
import { BusinessService } from '../../../../src/business/services';
import { BusinessModel } from '../../../../src/business/models';
import { BusinessDto } from '../../../../src/business/dto';
import { EventDispatcher } from '@pe/nest-kit';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('BusinessService', () => {
  let sandbox: sinon.SinonSandbox;
  let testService: BusinessService;
  let businessModel: Model<BusinessModel>;
  let eventDispatcher: EventDispatcher;

  const business: BusinessModel = {
    id: uuid.v4(),
    toObject(): any { return this },
  } as any;

  before(() => {
    businessModel = {
      create: (): any => { },
      findOne: (): any => { },
      findOneAndUpdate: (): any => { },
      findByIdAndRemove: (): any => { },
      update: (): any => { },
    } as any;

    eventDispatcher = {
      dispatch: (): any => { },
    } as any;

    testService = new BusinessService(businessModel, eventDispatcher);
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    sandbox = undefined;
  });

  describe('create()', () => {
    it('should create attributeModel', async () => {
      const businessDto: BusinessDto = {
        id: uuid.v4(),
        name: 'Test',
      } as any;

      sandbox.stub(businessModel, 'create').resolves(business);

      expect(
        await testService.create(businessDto),
      ).to.equal(business);
    });

    it('should throw error while creating attributeModel', async () => {
      const businessDto: BusinessDto = {
      } as any;

      sandbox.stub(businessModel, 'create').throws({
        code: 123,
        name: 'SomeError',
      });
      sandbox.stub(businessModel, 'findOne').resolves(business);
      const spy: sinon.SinonSpy = sandbox.spy(testService, 'create');
      try {
        await testService.create(businessDto);
      } catch (e) { }
      expect(spy.threw());
    });
  });

  describe('findOneById()', () => {
    it('should find a business by uuid', async () => {
      sandbox.stub(businessModel, 'findOne').resolves(business);

      expect(
        await testService.findOneById(business.id),
      ).to.equal(business);
    });
  });

  describe('deleteOneById()', () => {
    it('should find a business by id and delete it', async () => {
      sandbox.stub(businessModel, 'findByIdAndRemove').returns({ exec: () => Promise.resolve(business) } as any);

      await testService.deleteOneById(business.id);
    });
  });

  describe('updateById()', () => {
    it('should find business by id and update it', async () => {
      const businessDto: BusinessDto = {
      } as any;

      sandbox.stub(businessModel, 'update').resolves({ ok: 1, n: 1, nModified: 1 });

      expect(
        await testService.updateById(
          business.id,
          businessDto,
        ),
      ).to.contain({
        ok: 1,
      });
    });
  });
});

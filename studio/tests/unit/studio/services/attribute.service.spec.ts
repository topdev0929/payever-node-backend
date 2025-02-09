import 'mocha';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as uuid from 'uuid';
import { Query, Model } from 'mongoose';
import { AttributeService } from '../../../../src/studio/services';
import { AttributeModel, UserMediaModel, SubscriptionMediaModel } from '../../../../src/studio/models';
import { AttributeInterface } from '../../../../src/studio/interfaces';
import { BuilderPaginationDto } from '../../../../src/studio/dto';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('AttributeService', () => {
  let sandbox: sinon.SinonSandbox;
  let testService: AttributeService;
  let attributeModel: Model<AttributeModel>;
  let userMediaModel: Model<UserMediaModel>;
  let subscriptionMediaModel: Model<SubscriptionMediaModel>;

  let querySort: Query<AttributeModel[], AttributeModel> = {
    sort: (): any => { },
  } as any;
  let querySkip: Query<AttributeModel[], AttributeModel> = {
    skip: (): any => { },
  } as any;
  let queryLimit: Query<AttributeModel[], AttributeModel> = {
    limit: (): any => { },
  } as any;

  const attribute: AttributeModel = {
    id: uuid.v4(),
    remove: (): any => { },
    toObject(): any { return this },
  } as any;

  before(() => {
    attributeModel = {
      create: (): any => { },
      find: (): any => { },
      deleteOne: (): any => { },
      findOne: (): any => { },
      findOneAndRemove: (): any => { },
      findOneAndUpdate: (): any => { },
      aggregate: (): any => { },
      remove: (): any => { },
      limit(): any { return this },
      sort(): any { return this },
    } as any;

    userMediaModel = {
      create: (): any => { },
      find: (): any => { },
      findOne: (): any => { },
      findOneAndRemove: (): any => { },
      findOneAndUpdate: (): any => { },
      updateMany: (): any => { },
      limit(): any { return this },
      sort(): any { return this },
    } as any;

    subscriptionMediaModel = {
      create: (): any => { },
      find: (): any => { },
      findOne: (): any => { },
      findOneAndRemove: (): any => { },
      findOneAndUpdate: (): any => { },
      updateMany: (): any => { },
      limit(): any { return this },
      sort(): any { return this },
    } as any;

    testService = new AttributeService(attributeModel, userMediaModel, subscriptionMediaModel);
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
      const attributeDto: AttributeInterface = {
        id: uuid.v4(),
        icon: 'https://example.com/icon.png',
        name: 'icon',
        type: 'image',
      } as any;

      sandbox.stub(attributeModel, 'create').resolves(attribute);

      expect(
        await testService.create(attributeDto),
      ).to.eq(attribute);
    });

    it('should throw error while creating attributeModel', async () => {
      const attributeDto: AttributeInterface = {
      } as any;

      sandbox.stub(attributeModel, 'create').throws({
        code: 123,
        name: 'SomeError',
      });
      sandbox.stub(attributeModel, 'findOne').resolves(attribute);
      const spy: sinon.SinonSpy = sandbox.spy(testService, 'create');
      try {
        await testService.create(attributeDto);
      } catch (e) { }
      expect(spy.threw());
    });
  });

  describe('update()', () => {
    it('should update attributeModel by uuid', async () => {
      const attributeDto: AttributeInterface = {
        id: uuid.v4(),
      } as any;

      sandbox.stub(attributeModel, 'findOneAndUpdate').resolves(attribute);

      expect(
        await testService.update(attribute.id, attributeDto),
      ).to.eq(attribute);
    });

    it('should should throw error', async () => {
      const id = uuid.v4();
      const attributeDto: AttributeInterface = {
        id,
      } as any;

      const attribute: AttributeModel = {
        id,
        uuid: uuid.v4(),
        icon: 'https://example.com/icon.png',
        name: 'icon',
        type: 'image',
      } as any;

      sandbox.stub(attributeModel, 'findOneAndUpdate').throws({
        code: 100,
        name: 'SomeOtherError',
      });

      const spy: sinon.SinonSpy = sandbox.spy(testService, 'update');
      try {
        await testService.update(attribute.id, attributeDto);
      } catch (e) { }
      expect(spy.threw());
    });
  });

  describe('findAll()', () => {
    it('should find all attribute model instances', async () => {
      sandbox.stub(attributeModel, 'find').returns(querySort);
      sandbox.stub(querySort, 'sort').returns(querySkip);
      sandbox.stub(querySkip, 'skip').returns(queryLimit);
      sandbox.stub(queryLimit, 'limit').resolves([attribute]);

      expect(
        await testService.findAll(new BuilderPaginationDto()),
      ).to.deep.equal([attribute]);
    });
  });

  describe.skip('findType()', () => {
    // it('should find all attribute types model instances', async () => {
    //   sandbox.stub(attributeModel, 'aggregate').returns([{
    //     _id: attribute.type,
    //   }]);
    //
    //   expect(
    //     await testService.findType(),
    //   ).to.deep.equal([attribute.type]);
    // });
  });

  describe('findAllByType()', () => {
    it('should find all attribute model instances by specific type', async () => {
      sandbox.stub(attributeModel, 'find').returns(querySort);
      sandbox.stub(querySort, 'sort').returns(querySkip);
      sandbox.stub(querySkip, 'skip').returns(queryLimit);
      sandbox.stub(queryLimit, 'limit').resolves([attribute]);

      expect(
        await testService.findAllByType(
          'image',
          new BuilderPaginationDto()
        ),
      ).to.deep.equal([attribute]);
    });
  });

  describe('remove()', () => {
    it('should remove attribute model by uuid', async () => {
      sandbox.stub(userMediaModel, 'updateMany').returns({ exec: () => Promise.resolve({ }) } as any);
      sandbox.stub(subscriptionMediaModel, 'updateMany').returns({ exec: () => Promise.resolve({ }) } as any);
      sandbox.stub(attributeModel, 'deleteOne').returns({ exec: () => Promise.resolve(attribute) } as any);

      await testService.remove(attribute);
    });
  });
});

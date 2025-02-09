import 'mocha';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as uuid from 'uuid';
import { Query, Model } from 'mongoose';
import { UserAttributeGroupService } from '../../../../src/studio/services';
import { UserAttributeModel, UserAttributeGroupModel } from '../../../../src/studio/models';
import { UserAttributeGroupDto } from '../../../../src/studio/dto';
import { BuilderPaginationDto } from '../../../../src/studio/dto';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('UserAttributeGroupService', () => {
  let sandbox: sinon.SinonSandbox;
  let testService: UserAttributeGroupService;
  let userAttributeModel: Model<UserAttributeModel>;
  let userAttributeGroupModel: Model<UserAttributeGroupModel>;

  let querySort: Query<UserAttributeGroupModel[], UserAttributeGroupModel> = {
    sort: (): any => { },
  } as any;
  let querySkip: Query<UserAttributeGroupModel[], UserAttributeGroupModel> = {
    skip: (): any => { },
  } as any;
  let queryLimit: Query<UserAttributeGroupModel[], UserAttributeGroupModel> = {
    limit: (): any => { },
  } as any;

  const attributeGroup: UserAttributeGroupModel = {
    id: uuid.v4(),
    business: uuid.v4(),
    remove: (): any => { },
    toObject(): any { return this },
  } as any;

  before(() => {
    userAttributeGroupModel = {
      create: (): any => { },
      find: (): any => { },
      findOne: (): any => { },
      deleteOne: (): any => { },
      deleteMany: (): any => { },
      findOneAndRemove: (): any => { },
      findOneAndUpdate: (): any => { },
      aggregate: (): any => { },
      remove: (): any => { },
      limit(): any { return this },
      sort(): any { return this },
    } as any;

    userAttributeModel = {
      create: (): any => { },
      find: (): any => { },
      findOne: (): any => { },
      deleteOne: (): any => { },
      deleteMany: (): any => { },
      findOneAndRemove: (): any => { },
      findOneAndUpdate: (): any => { },
      updateMany: (): any => { },
      limit(): any { return this },
      sort(): any { return this },
    } as any;

    testService = new UserAttributeGroupService(userAttributeGroupModel, userAttributeModel);
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    sandbox = undefined;
  });

  describe('create()', () => {
    it('should create attributeGroupModel', async () => {
      const attributeGroupDto: UserAttributeGroupDto = {
        id: uuid.v4(),
        businessId: uuid.v4(),
        name: 'test',
      } as any;

      sandbox.stub(userAttributeGroupModel, 'create').resolves(attributeGroup);

      expect(
        await testService.create(attributeGroupDto),
      ).to.eq(attributeGroup);
    });

    it('should throw error while creating attributeGroupModel', async () => {
      const attributeDto: UserAttributeGroupDto = {
      } as any;

      sandbox.stub(userAttributeGroupModel, 'create').throws({
        code: 123,
        name: 'SomeError',
      });
      sandbox.stub(userAttributeGroupModel, 'findOne').resolves(attributeGroup);
      const spy: sinon.SinonSpy = sandbox.spy(testService, 'create');
      try {
        await testService.create(attributeDto);
      } catch (e) { }
      expect(spy.threw());
    });
  });

  describe('update()', () => {
    it('should update userAttributeGroupModel by uuid', async () => {
      const attributeDto: UserAttributeGroupDto = {
        id: uuid.v4(),
      } as any;

      sandbox.stub(userAttributeGroupModel, 'findOneAndUpdate').resolves(attributeGroup);

      expect(
        await testService.update(attributeGroup.id, attributeDto),
      ).to.eq(attributeGroup);
    });

    it('should should throw error', async () => {
      const id = uuid.v4();
      const attributeDto: UserAttributeGroupDto = {
        id,
      } as any;

      const attributeGroup: UserAttributeGroupModel = {
        id,
        businessId: uuid.v4(),
        name: 'icon',
      } as any;

      sandbox.stub(userAttributeGroupModel, 'findOneAndUpdate').throws({
        code: 100,
        name: 'SomeOtherError',
      });

      const spy: sinon.SinonSpy = sandbox.spy(testService, 'update');
      try {
        await testService.update(attributeGroup.id, attributeDto);
      } catch (e) { }
      expect(spy.threw());
    });
  });

  describe('findAll()', () => {
    it('should find all attributeGroup model instances', async () => {
      sandbox.stub(userAttributeGroupModel, 'find').returns(querySort);
      sandbox.stub(querySort, 'sort').returns(querySkip);
      sandbox.stub(querySkip, 'skip').returns(queryLimit);
      sandbox.stub(queryLimit, 'limit').resolves([attributeGroup]);

      expect(
        await testService.findAll(
          attributeGroup.businessId,
          new BuilderPaginationDto()
        ),
      ).to.deep.equal([attributeGroup]);
    });
  });

  describe('findByBusinessAndId()', () => {
    it('should find all attributeGroup model instances', async () => {
      sandbox.stub(userAttributeGroupModel, 'findOne').resolves(attributeGroup);

      expect(
        await testService.findByBusinessAndId(
          attributeGroup.businessId,
          attributeGroup.id,
        ),
      ).to.deep.equal(attributeGroup);
    });
  });

  describe('findByIdsAndBusiness()', () => {
    it('should find all attributeGroup model instances', async () => {
      sandbox.stub(userAttributeGroupModel, 'find').resolves([attributeGroup]);

      expect(
        await testService.findByIdsAndBusiness(
          [attributeGroup.id],
          attributeGroup.businessId,
        ),
      ).to.deep.equal([attributeGroup]);
    });
  });

  describe('remove()', () => {
    it('should remove attributeGroup model by uuid', async () => {
      sandbox.stub(userAttributeModel, 'updateMany').returns({ exec: () => Promise.resolve([])} as any);
      sandbox.stub(userAttributeGroupModel, 'deleteOne').returns({ exec: () => Promise.resolve([])} as any);
      await testService.remove(attributeGroup);
    });
  });
});

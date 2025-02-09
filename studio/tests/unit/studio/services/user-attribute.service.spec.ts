import 'mocha';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as uuid from 'uuid';
import { Query, Model } from 'mongoose';
import { UserAttributeGroupService, UserAttributeService } from '../../../../src/studio/services';
import { UserAttributeModel, UserAttributeGroupModel, UserAlbumModel, UserMediaModel } from '../../../../src/studio/models';
import { BusinessModel } from '../../../../src/business/models';
import { UserAttributeDto, AttributeFilterDto, BuilderPaginationDto } from '../../../../src/studio/dto';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('UserAttributeService', () => {
  let sandbox: sinon.SinonSandbox;
  let testService: UserAttributeService;
  let userAttributeGroupService: UserAttributeGroupService;
  let userAttributeModel: Model<UserAttributeModel>;
  let userMediaModel: Model<UserMediaModel>;
  let userAlbumModel: Model<UserAlbumModel>;

  let querySelect: Query<UserAttributeModel[], UserAttributeModel> = {
    select: (): any => { },
  } as any;
  let querySort: Query<UserAttributeModel[], UserAttributeModel> = {
    sort: (): any => { },
  } as any;
  let querySkip: Query<UserAttributeModel[], UserAttributeModel> = {
    skip: (): any => { },
  } as any;
  let queryLimit: Query<UserAttributeModel[], UserAttributeModel> = {
    limit: (): any => { },
  } as any;

  const business: BusinessModel = {
    id: uuid.v4(),
  } as any;

  const attribute: UserAttributeModel = {
    id: uuid.v4(),
    business: business.id,
    userAttributeGroup: uuid.v4(),
    remove: (): any => { },
    populate(): any { return this },
    execPopulate(): any { return this },
    toObject(): any { return this },
  } as any;

  before(() => {
    userAttributeModel = {
      create: (): any => { },
      deleteOne: (): any => { },
      find: (): any => { },
      findOne: (): any => { },
      findOneAndRemove: (): any => { },
      findOneAndUpdate: (): any => { },
      updateMany: (): any => { },
      aggregate: (): any => { },
      populate(): any { return this },
      execPopulate(): any { return this },
      select(field: string): any { return this[field] },
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
      remove: (): any => { },
      limit(): any { return this },
      sort(): any { return this },
    } as any;

    userAlbumModel = {
      create: (): any => { },
      find: (): any => { },
      findOne: (): any => { },
      findOneAndRemove: (): any => { },
      findOneAndUpdate: (): any => { },
      updateMany: (): any => { },
      remove: (): any => { },
      limit(): any { return this },
      sort(): any { return this },
    } as any;

    userAttributeGroupService = {
      findByBusinessAndId: (): any => { },
    } as any;

    testService = new UserAttributeService(userMediaModel, userAlbumModel, userAttributeModel, userAttributeGroupService);
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    sandbox = undefined;
  });

  describe('create()', () => {
    it('should create attribute Model instance', async () => {
      const attributeGroupDto: UserAttributeDto = {
        id: uuid.v4(),
        businessId: uuid.v4(),
        name: 'test',
      } as any;

      sandbox.stub(userAttributeModel, 'create').resolves(attribute);

      expect(
        await testService.create(attributeGroupDto),
      ).to.eq(attribute);
    });

    it('should create attribute Model instance with userAttributeGroupId', async () => {
      const attributeGroupDto: UserAttributeDto = {
        id: uuid.v4(),
        businessId: uuid.v4(),
        name: 'test',
        userAttributeGroupId: 'id',
      } as any;
      const userAttributeGroup: UserAttributeGroupModel = {
      } as any;

      sandbox.stub(userAttributeGroupService, 'findByBusinessAndId').resolves(userAttributeGroup);
      sandbox.stub(userAttributeModel, 'create').resolves(attribute);

      expect(
        await testService.create(attributeGroupDto),
      ).to.eq(attribute);
    });

    it('should throw error while creating attribute Model instance', async () => {
      const attributeDto: UserAttributeDto = {
      } as any;

      sandbox.stub(userAttributeModel, 'create').throws({
        code: 123,
        name: 'SomeError',
      });
      sandbox.stub(userAttributeModel, 'findOne').resolves(attribute);
      const spy: sinon.SinonSpy = sandbox.spy(testService, 'create');
      try {
        await testService.create(attributeDto);
      } catch (e) { }
      expect(spy.threw());
    });
  });

  describe('update()', () => {
    it('should update userAttributeGroupModel by uuid', async () => {
      const attributeDto: UserAttributeDto = {
        id: uuid.v4(),
      } as any;

      sandbox.stub(userAttributeModel, 'findOneAndUpdate').resolves(attribute);

      expect(
        await testService.update(attribute.id, attributeDto),
      ).to.eq(attribute);
    });

    it('should should throw error', async () => {
      const id = uuid.v4();
      const attributeDto: UserAttributeDto = {
        id,
      } as any;

      const attribute: UserAttributeGroupModel = {
        id,
        businessId: uuid.v4(),
        name: 'icon',
      } as any;

      sandbox.stub(userAttributeModel, 'findOneAndUpdate').throws({
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
      sandbox.stub(userAttributeModel, 'find').returns(querySort);
      sandbox.stub(querySort, 'sort').returns(querySkip);
      sandbox.stub(querySkip, 'skip').returns(queryLimit);
      sandbox.stub(queryLimit, 'limit').resolves([attribute]);

      expect(
        await testService.findAll(
          attribute.businessId,
          new BuilderPaginationDto()
        ),
      ).to.deep.equal([attribute]);
    });
  });

  describe('findAllByType()', () => {
    it('should find all attribute model instances', async () => {
      sandbox.stub(userAttributeModel, 'find').returns(querySort);
      sandbox.stub(querySort, 'sort').returns(querySkip);
      sandbox.stub(querySkip, 'skip').returns(queryLimit);
      sandbox.stub(queryLimit, 'limit').resolves([attribute]);

      expect(
        await testService.findAllByType(
          attribute.businessId,
          attribute.type,
          new BuilderPaginationDto(),
        ),
      ).to.deep.equal([attribute]);
    });
  });

  describe('findType()', () => {
    it('should find all attribute model instances', async () => {
      sandbox.stub(userAttributeModel, 'aggregate').returns({ exec: () => Promise.resolve([
        { _id: attribute.type },
      ])} as any);

      expect(
        await testService.findType(
          attribute.businessId,
        ),
      ).to.deep.equal([attribute.type]);
    });
  });

  describe('remove()', () => {
    it('should remove attribute model by uuid', async () => {
      sandbox.stub(userMediaModel, 'updateMany').returns({ exec: () => Promise.resolve([])} as any);
      sandbox.stub(userAlbumModel, 'updateMany').returns({ exec: () => Promise.resolve([])} as any);
      sandbox.stub(userAttributeModel, 'deleteOne').returns({ exec: () => Promise.resolve([])} as any);
      await testService.remove(attribute);
    });
  });

  describe('findByIdAndBusiness()', () => {
    it('should find attribute model instances by id and business', async () => {
      sandbox.stub(userAttributeModel, 'findOne').resolves(attribute);

      expect(
        await testService.findByIdAndBusiness(
          attribute.id,
          attribute.businessId,
        ),
      ).to.deep.equal(attribute);
    });
  });

  describe('findByIdsAndBusiness()', () => {
    it('should find all attribute model instances', async () => {
      sandbox.stub(userAttributeModel, 'find').resolves([attribute]);

      expect(
        await testService.findByIdsAndBusiness(
          [attribute.id],
          attribute.businessId,
        ),
      ).to.deep.equal([attribute]);
    });
  });

  describe('findByIdsAndBusiness()', () => {
    it('should find all attribute model instances', async () => {
      sandbox.stub(userAttributeModel, 'find').resolves([attribute]);

      expect(
        await testService.findByIdsAndBusiness(
          [attribute.id],
          attribute.businessId,
        ),
      ).to.deep.equal([attribute]);
    });
  });

  describe('generateUserAttributeByGroup()', () => {
    it('should find all attribute model instances', async () => {
      sandbox.stub(userAttributeModel, 'find').resolves([attribute]);
      expect(
        await testService.generateUserAttributeByGroup(
          attribute.businessId,
          [attribute.userAttributeGroup],
        ),
      ).to.deep.equal([
        {
          attribute: attribute.id,
          value: attribute.defaultValue,
        }
      ]);
    });
  });

  describe('findNonOnlyAdminByIdsAndBusiness()', () => {
    it('should find all attribute model instances', async () => {
      sandbox.stub(userAttributeModel, 'find').resolves([attribute]);

      expect(
        await testService.findByIdsAndBusiness(
          [attribute.userAttributeGroup],
          attribute.businessId,
        ),
      ).to.deep.equal([attribute]);
    });
  });

  describe('filterAttributeByFilterAbleOnly()', () => {
    it('should find all attribute model instances', async () => {
      const attributeFilterDto: AttributeFilterDto = {
        attributes: [
          { attribute: 'test', value: 'test' },
        ]
      };

      sandbox.stub(userAttributeModel, 'find').returns(querySelect);
      sandbox.stub(querySelect, 'select').resolves([attribute]);

      expect(
        await testService.filterAttributeByFilterAbleOnly(
          business,
          attributeFilterDto,
        ),
      ).to.deep.equal(attributeFilterDto);
    });
  });

  describe('filterAttributeByNonOnlyAdmin()', () => {
    it('should find all attribute model instances', async () => {
      const attributes = [
        { attribute: 'test', value: 'test' },
      ];

      sandbox.stub(userAttributeModel, 'find').returns(querySelect);
      sandbox.stub(querySelect, 'select').resolves([attribute]);

      expect(
        await testService.filterAttributeByNonOnlyAdmin(
          attribute.businessId,
          attributes,
        ),
      ).to.deep.equal(attributes);
    });
  });
});

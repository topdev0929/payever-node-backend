// tslint:disable: object-literal-sort-keys
import 'mocha';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as uuid from 'uuid';
import { Query, Model } from 'mongoose';
import {
  UserAttributeService,
  UserAlbumService,
  UserMediaService,
  CounterService,
} from '../../../../src/studio/services';
import { UserAlbumModel, UserAttributeModel } from '../../../../src/studio/models';
import { UserAlbumDto, AttributeFilterDto, UpdateUserAlbumDto, BuilderPaginationDto } from '../../../../src/studio/dto';
import { BusinessModel } from '../../../../src/business/models';
import { UserMediaAttributeInterface } from '../../../../src/studio/interfaces';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

// tslint:disable-next-line: no-big-function
describe('UserAlbumService', () => {
  let sandbox: sinon.SinonSandbox;
  let testService: UserAlbumService;
  let userAlbumModel: Model<UserAlbumModel>;
  let userAttributeService: UserAttributeService;
  let userMediaService: UserMediaService;
  let counterService: CounterService;

  const queryPopulate: any = {
    populate: (): any => { },
  } as any;
  const querySort: Query<UserAlbumModel[], UserAlbumModel> = {
    sort: (): any => { },
  } as any;

  const business: BusinessModel = {
    id: uuid.v4(),
  } as any;

  const album: UserAlbumModel = {
    id: uuid.v4(),
    userAttributes: [],
    remove: (): any => { },
    populate(): any { return this; },
    execPopulate(): any { return this; },
    filter(): any { return this; },
    toObject(): any { return this; },
  } as any;

  before(() => {
    userAlbumModel = {
      create: (): any => { },
      find: (): any => { },
      findOne: (): any => { },
      deleteOne: (): any => { },
      findOneAndRemove: (): any => { },
      findOneAndUpdate: (): any => { },
      updateOne: (): any => { },
      aggregate: (): any => { },
      remove: (): any => { },
      populate(): any { return this; },
      execPopulate(): any { return this; },
      limit(): any { return this; },
      sort(): any { return this; },
    } as any;

    userAttributeService = {
      filterAttributeByFilterAbleOnly: (): any => { },
      generateUserAttributeByGroup: (): any => { },
      findByIdAndBusiness: (): any => { },
    } as any;

    userMediaService = {
      getByAlbum: (): any => { },
      duplicate: (): any => { },
    } as any;

    counterService = {
      getNextCounter: (): any => { },
    } as any;

    testService = new UserAlbumService(
      userAlbumModel,
      userAttributeService,
      userMediaService,
      counterService,
    );
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
      const userAlbumDto: UserAlbumDto = {
        id: uuid.v4(),
        icon: 'https://example.com/icon.png',
        name: 'icon',
        type: 'image',
        userAttributeGroups: ['test'],
      } as any;
      const createdAlbum: any = { populate: () => { } };

      sandbox.stub(userAttributeService, 'generateUserAttributeByGroup').resolves([]);
      sandbox.stub(userAlbumModel, 'findOne').returns({ exec: () => Promise.resolve(null)} as any);
      sandbox.stub(userAlbumModel, 'create').resolves(createdAlbum);
      sandbox.stub(createdAlbum, 'populate').returns({ execPopulate: () => Promise.resolve(album)} as any);

      expect(
        await testService.create(business, userAlbumDto),
      ).to.eq(album);
    });

    it('should throw error while creating attributeModel', async () => {
      const userAlbumDto: UserAlbumDto = {
      } as any;

      sandbox.stub(userAlbumModel, 'create').throws({
        code: 123,
        name: 'SomeError',
      });

      const spy: sinon.SinonSpy = sandbox.spy(testService, 'create');
      try {
        await testService.create(business, userAlbumDto);
      } catch (e) { }
      expect(spy.threw());
    });
  });

  describe('update()', () => {
    it('should update userAlbumModel by uuid', async () => {
      const userAlbumDto: UpdateUserAlbumDto = {
        id: uuid.v4(),
        parent: uuid.v4(),
        userAttributeGroups: ['test'],
      } as any;
      const userMediaAttribute: UserMediaAttributeInterface = {
        attribute: 'test',
        value: 'test',
      } as any;

      sandbox.stub(userAlbumModel, 'findOne').returns({ exec: () => Promise.resolve(album)} as any);

      sandbox.stub(userAttributeService, 'generateUserAttributeByGroup').resolves([userMediaAttribute]);

      sandbox.stub(userAlbumModel, 'findOneAndUpdate').returns({ exec: () => Promise.resolve(album)} as any);

      sandbox.stub(userAlbumModel, 'find').returns({ exec: () => Promise.resolve([])} as any);

      expect(
        await testService.update(album.id, business, userAlbumDto),
      ).to.eq(album);
    });

    it('should throw error', async () => {
      const id: string = uuid.v4();
      const userAlbumDto: UpdateUserAlbumDto = {
        id,
      } as any;

      sandbox.stub(userAlbumModel, 'findOne').throws({
        code: 100,
        name: 'SomeOtherError',
      });

      const spy: sinon.SinonSpy = sandbox.spy(testService, 'update');
      try {
        await testService.update(album.id, business, userAlbumDto);
      } catch (e) { }
      expect(spy.threw());
    });
  });

  describe('remove()', () => {
    it('should remove album model by uuid', async () => {
      sandbox.stub(userAlbumModel, 'deleteOne').returns({ exec: () => Promise.resolve({ })} as any);

      await testService.remove(album);
    });
  });

  describe('findById()', () => {
    it('should find an album model instance', async () => {
      sandbox.stub(userAlbumModel, 'findOne').returns(queryPopulate);
      sandbox.stub(queryPopulate, 'populate').resolves(album);

      expect(
        await testService.findById(album.id),
      ).to.equal(album);
    });
  });

  describe('findByIdAndBusiness()', () => {
    it('should find an album model instance', async () => {
      sandbox.stub(userAlbumModel, 'findOne').resolves(album);

      expect(
        await testService.findByIdAndBusiness(album.id, business.id),
      ).to.equal(album);
    });
  });

  describe('findByNameAndBusiness()', () => {
    it('should find an album model instance', async () => {
      sandbox.stub(userAlbumModel, 'findOne').resolves(album);

      expect(
        await testService.findByNameAndBusiness(album.name, business.id),
      ).to.equal(album);
    });
  });

  describe('findByBusinessId()', () => {
    it('should find all album model instances', async () => {
      sandbox.stub(userAlbumModel, 'find').resolves([album]);

      expect(
        await testService.findByBusinessId(
          new BuilderPaginationDto(),
          business,
        ),
      ).to.deep.equal([album]);
    });
  });

  describe('findByBusinessIdAndAncestor()', () => {
    it('should find all album model instances', async () => {
      sandbox.stub(userAlbumModel, 'find').resolves([album]);

      expect(
        await testService.findByBusinessIdAndAncestor(
          new BuilderPaginationDto(),
          business,
          album.id,
        ),
      ).to.deep.equal([album]);
    });
  });

  describe('findByUserAttribute()', () => {
    it('should find all album model instances', async () => {
      const attribute: UserAttributeModel = {
      } as any;

      sandbox.stub(userAttributeService, 'findByIdAndBusiness').resolves(attribute);
      sandbox.stub(userAlbumModel, 'find').returns(queryPopulate);
      sandbox.stub(queryPopulate, 'populate').returns(querySort);
      sandbox.stub(querySort, 'sort').returns({ exec: () => Promise.resolve([album])} as any);

      expect(
        await testService.findByUserAttribute(
          new BuilderPaginationDto(),
          business,
          'test',
          'test',
        ),
      ).to.deep.equal([album]);
    });

    it('should return undefined', async () => {
      const attribute: UserAttributeModel = {
        filterAble: false,
      } as any;

      sandbox.stub(userAttributeService, 'findByIdAndBusiness').resolves(attribute);

      expect(
        await testService.findByUserAttribute(
          new BuilderPaginationDto(),
          business,
          'test',
          'test',
        ),
      ).to.equal(undefined);
    });

    it('should return undefined', async () => {
      sandbox.stub(userAttributeService, 'findByIdAndBusiness').resolves(undefined);

      expect(
        await testService.findByUserAttribute(
          new BuilderPaginationDto(),
          business,
          'test',
          'test',
        ),
      ).to.equal(undefined);
    });
  });


  describe('findByMultipleUserAttributes()', () => {
    it('should find all album model instances by specific type', async () => {
      const filter: AttributeFilterDto = {
        attributes: [
          { attribute: 'test', value: 'test' },
        ],
      };

      sandbox.stub(userAttributeService, 'filterAttributeByFilterAbleOnly').resolves(filter);

      sandbox.stub(userAlbumModel, 'find').returns(queryPopulate);
      sandbox.stub(queryPopulate, 'populate').returns({ exec: () => Promise.resolve([album])});

      expect(
        await testService.findByMultipleUserAttributes(
          new BuilderPaginationDto(),
          business,
          filter,
        ),
      ).to.deep.equal([album]);
    });
  });
});

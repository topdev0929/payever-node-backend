import 'mocha';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as uuid from 'uuid';
import { Query, Model } from 'mongoose';
import { EventDispatcher } from '@pe/nest-kit';
import {
  ImageAssessmentTaskService,
  MediaInfoTaskService,
  UserAttributeService,
  UserMediaService,
  MediaUploadService,
  CounterService, QueryBuilderService,
} from '../../../../src/studio/services';
import { UserMediaModel, UserAlbumModel, UserAttributeModel } from '../../../../src/studio/models';
import { AttributeInterface, MediaInfoInterface, UserMediaAttributeInterface, UserMediaUploadedInterface } from '../../../../src/studio/interfaces';
import { BuilderPaginationDto, IdsDto, SearchMediaDto, AttributeFilterDto, UserMediaDto } from '../../../../src/studio/dto';
import { BusinessService } from '../../../../src/business/services';
import { BusinessMediaMessagesProducer } from '../../../../src/studio/producers';
import { BusinessModel } from '../../../../src/business/models';
import { MediaTypeEnum } from '../../../../src/studio/enums';
import { BlobInterface } from '../../../../src/studio/interfaces/blob.interface';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('UserMediaService', () => {
  let sandbox: sinon.SinonSandbox;
  let testService: UserMediaService;
  let userMediaModel: Model<UserMediaModel>;
  let eventDispatcher: EventDispatcher;
  let businessService: BusinessService;
  let imageAssessmentTaskService: ImageAssessmentTaskService;
  let mediaInfoTaskService: MediaInfoTaskService;
  let businessMediaMessagesProducer: BusinessMediaMessagesProducer;
  let userAttributeService: UserAttributeService;
  let mediaUploadService: MediaUploadService;
  let counterService: CounterService;
  let queryBuilderService: QueryBuilderService;

  let queryPopulate: any = {
    populate: (): any => { },
  } as any;
  let queryPopulateSecond: any = {
    populate: (): any => { },
  } as any;
  let querySort: Query<UserMediaModel[], UserMediaModel> = {
    sort: (): any => { },
  } as any;
  let querySkip: Query<UserMediaModel[], UserMediaModel> = {
    skip: (): any => { },
  } as any;
  let queryLimit: Query<UserMediaModel[], UserMediaModel> = {
    limit: (): any => { },
  } as any;

  const business: BusinessModel = {
    id: uuid.v4(),
    remove: (): any => { },
    toObject(): any { return this },
  } as any;

  const album: UserAlbumModel = {
    id: uuid.v4(),
    toObject(): any { return this },
  } as any;

  const media: UserMediaModel = {
    id: uuid.v4(),
    business: business.id,
    userAttributes: [],
    remove: (): any => { },
    populate(): any { return this },
    execPopulate(): any { return this },
    toObject(): any { return this },
  } as any;

  before(() => {
    userMediaModel = {
      create: (): any => { },
      find: (): any => { },
      findOne: (): any => { },
      deleteOne: (): any => { },
      deleteMany: (): any => { },
      findOneAndUpdate: (): any => { },
      findByIdAndRemove: (): any => { },
      update: (): any => { },
      updateMany: (): any => { },
      remove: (): any => { },
      populate(): any { return this },
    } as any;

    eventDispatcher = {
      dispatch: (): any => { },
    } as any;

    businessService = {
      findOneById: (): any => { },
    } as any;

    imageAssessmentTaskService = {
      dispatch: (): any => { },
    } as any;

    mediaInfoTaskService = {
      create: (): any => { },
    } as any;

    businessMediaMessagesProducer = {
      sendMediaCreatedMessage: (): any => { },
      sendMediaUpdatedMessage: (): any => { },
      sendMediaDeletedMessage: (): any => { },
    } as any;

    userAttributeService = {
      findByIdAndBusiness: (): any => { },
      generateUserAttributeByGroup: (): any => { },
      filterAttributeByNonOnlyAdmin: (): any => { },
      filterAttributeByFilterAbleOnly: (): any => { },
    } as any;

    mediaUploadService = {
      parseNameAndType: (): any => { },
    } as any;

    counterService = {
      getNextCounter: (): any => { },
    } as any;

    queryBuilderService = {
      buildQuery: (): any => { },
    } as any;

    testService = new UserMediaService(
      userMediaModel,
      eventDispatcher,
      businessService,
      mediaInfoTaskService,
      businessMediaMessagesProducer,
      userAttributeService,
      mediaUploadService,
      counterService,
      queryBuilderService,
    );
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    sandbox = undefined;
  });

  describe('findByUrlAndUpdateOrInsert()', () => {
    it('should create userMediaModel', async () => {
      const userMediaDto: UserMediaDto = {
        url: '',
        mediaType: MediaTypeEnum.IMAGE,
        businessId: business.id,
        userAttributes: [],
      } as any;

      const attribute: UserMediaAttributeInterface = {
        attribute: 'test',
        value: 'test',
      } as any;

      sandbox.stub(userAttributeService, 'filterAttributeByNonOnlyAdmin').resolves([attribute]);
      sandbox.stub(userAttributeService, 'generateUserAttributeByGroup').resolves([attribute]);

      sandbox.stub(userMediaModel, 'findOne').returns({ exec: () => Promise.resolve(null)} as any);
      sandbox.stub(userMediaModel, 'findOneAndUpdate').resolves(media);
      sandbox.stub(userMediaModel, 'create').resolves(media);
      sandbox.stub(businessMediaMessagesProducer, 'sendMediaUpdatedMessage').resolves();

      expect(
        await testService.create(
          business.id,
          userMediaDto,
          [],
        ),
      ).to.eq(media);
    });

    it('should throw error while creating userMediaModel', async () => {
      const userMediaDto: UserMediaDto = {
      } as any;

      sandbox.stub(businessService, 'findOneById').throws({
        code: 123,
        name: 'SomeError',
      });

      const spy: sinon.SinonSpy = sandbox.spy(testService, 'create');
      try {
        await testService.create(
          business.id,
          userMediaDto,
          [],
        );
      } catch (e) { }
      expect(spy.threw());
    });
  });

  describe('updateMediaInfoById()', () => {
    it('should update userMediaModel by uuid', async () => {
      const userMediaDto: MediaInfoInterface = {
        id: uuid.v4(),
      } as any;

      sandbox.stub(userMediaModel, 'findOneAndUpdate').resolves(media);

      expect(
        await testService.updateMediaInfoById(media.id, userMediaDto),
      ).to.eq(media);
    });

    it('should should throw error', async () => {
      const id = uuid.v4();
      const userMediaDto: AttributeInterface = {
        id,
      } as any;

      sandbox.stub(userMediaModel, 'findOneAndUpdate').throws({
        code: 100,
        name: 'SomeOtherError',
      });

      const spy: sinon.SinonSpy = sandbox.spy(testService, 'updateMediaInfoById');
      try {
        await testService.updateMediaInfoById(media.id, userMediaDto);
      } catch (e) { }
      expect(spy.threw());
    });
  });

  describe('findById()', () => {
    it('should find media model instance by id', async () => {
      sandbox.stub(userMediaModel, 'findOne').returns(queryPopulate);
      sandbox.stub(queryPopulate, 'populate').returns(queryPopulateSecond);
      sandbox.stub(queryPopulateSecond, 'populate').returns({ exec: () => Promise.resolve(media)} as any);;

      expect(
        await testService.findById(media.id),
      ).to.equal(media);
    });
  });

  describe('findByIds()', () => {
    it('should find media model instances by ids', async () => {
      const idsDto: IdsDto = {
        ids: [media.id],
      };

      sandbox.stub(userMediaModel, 'find').resolves([media]);

      expect(
        await testService.findByIds(idsDto),
      ).to.deep.equal([media]);
    });
  });

  describe('remove()', () => {
    it('should remove media model by model', async () => {
      sandbox.stub(userMediaModel, 'deleteOne').returns({ exec: () => Promise.resolve([])} as any);
      await testService.remove(media);
    });
  });

  describe('removeAllByBusinessId()', () => {
    it('should remove media model by business uuid', async () => {
      sandbox.stub(userMediaModel, 'deleteMany').returns({ exec: () => Promise.resolve([])} as any);

      await testService.removeAllByBusinessId(media.businessId);
    });
  });

  describe('removeAllSampleByBusinessId()', () => {
    it('should remove all sample media model by business uuid', async () => {
      sandbox.stub(userMediaModel, 'deleteMany').returns({ exec: () => Promise.resolve([])} as any);

      await testService.removeAllSampleByBusinessId(media.businessId);
    });
  });

  describe('findByBusinessId()', () => {
    it('should find all media model instances', async () => {
      sandbox.stub(userMediaModel, 'find').returns(queryPopulate);
      sandbox.stub(queryPopulate, 'populate').returns(queryPopulateSecond);
      sandbox.stub(queryPopulateSecond, 'populate').returns(querySort);
      sandbox.stub(querySort, 'sort').returns(querySkip);
      sandbox.stub(querySkip, 'skip').returns(queryLimit);
      sandbox.stub(queryLimit, 'limit').returns({ exec: () => Promise.resolve([media])} as any);

      expect(
        await testService.findByBusinessId(
          new BuilderPaginationDto(),
          business,
        ),
      ).to.deep.equal([media]);
    });
  });

  describe('searchMedia()', () => {
    it('should find all media model instances by search parameter', async () => {
      const searchDto: SearchMediaDto = {
        name: 'test',
        page: '1',
        limit: '3',
        asc: [],
        desc: [],
      };

      sandbox.stub(userMediaModel, 'find').returns(querySort);
      sandbox.stub(querySort, 'sort').returns(querySkip);
      sandbox.stub(querySkip, 'skip').returns(queryLimit);
      sandbox.stub(queryLimit, 'limit').returns({ exec: () => Promise.resolve([media])} as any);

      expect(
        await testService.searchMedia(
          searchDto,
          business,
        ),
      ).to.deep.equal([media]);
    });
  });

  describe('findByBusinessAndAlbumId()', () => {
    it('should find all media model instances', async () => {
      sandbox.stub(userMediaModel, 'find').returns(queryPopulate);
      sandbox.stub(queryPopulate, 'populate').returns(queryPopulateSecond);
      sandbox.stub(queryPopulateSecond, 'populate').returns(querySort);
      sandbox.stub(querySort, 'sort').returns(querySkip);
      sandbox.stub(querySkip, 'skip').returns(queryLimit);
      sandbox.stub(queryLimit, 'limit').returns({ exec: () => Promise.resolve([media])} as any);

      expect(
        await testService.findByBusinessAndAlbumId(
          new BuilderPaginationDto(),
          business,
          album,
        ),
      ).to.deep.equal([media]);
    });
  });

  describe('findByUserAttribute()', () => {
    it('should find all media model instances', async () => {
      const attribute: UserAttributeModel = {
      } as any;

      sandbox.stub(userAttributeService, 'findByIdAndBusiness').resolves(attribute);

      sandbox.stub(userMediaModel, 'find').returns(queryPopulate);
      sandbox.stub(queryPopulate, 'populate').returns(queryPopulateSecond);
      sandbox.stub(queryPopulateSecond, 'populate').returns(querySort);
      sandbox.stub(querySort, 'sort').returns(querySkip);
      sandbox.stub(querySkip, 'skip').returns(queryLimit);
      sandbox.stub(queryLimit, 'limit').returns({ exec: () => Promise.resolve([media])} as any);

      expect(
        await testService.findByUserAttribute(
          new BuilderPaginationDto(),
          business,
          'test',
          'test',
        ),
      ).to.deep.equal([media]);
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
    it('should find all media model instances', async () => {
      const userAttributeFilter: AttributeFilterDto = {
        attributes: [],
      } as any;

      sandbox.stub(userAttributeService, 'filterAttributeByFilterAbleOnly').resolves(userAttributeFilter);

      sandbox.stub(userMediaModel, 'find').returns(queryPopulate);
      sandbox.stub(queryPopulate, 'populate').returns(queryPopulateSecond);
      sandbox.stub(queryPopulateSecond, 'populate').returns(querySort);
      sandbox.stub(querySort, 'sort').returns(querySkip);
      sandbox.stub(querySkip, 'skip').returns(queryLimit);
      sandbox.stub(queryLimit, 'limit').returns({ exec: () => Promise.resolve([media])} as any);

      expect(
        await testService.findByMultipleUserAttributes(
          new BuilderPaginationDto(),
          business,
          userAttributeFilter,
        ),
      ).to.deep.equal([media]);
    });
  });

  describe('deleteMany()', () => {
    it('should delete media model instances by ids', async () => {
      const idsDto: IdsDto = {
        ids: [media.id],
      };

      sandbox.stub(userMediaModel, 'find').returns({ exec: () => Promise.resolve([media])} as any);
      sandbox.stub(userMediaModel, 'deleteMany').returns({ exec: () => Promise.resolve([])} as any);

      await testService.deleteMany(idsDto);
    });
  });

  describe('addMultipleMediaToAlbum()', () => {
    it('should add multiple medias to albums', async () => {
      const idsDto: IdsDto = {
        ids: [media.id],
      };
      sandbox.stub(userMediaModel, 'updateMany').returns({ exec: () => Promise.resolve([])} as any);

      await testService.addMultipleMediaToAlbum(
        uuid.v4(),
        idsDto,
        business,
      );
    });
  });

  describe('removeMultipleMediaFromAlbum()', () => {
    it('should remove multiple medias from albums', async () => {
      const idsDto: IdsDto = {
        ids: [media.id],
      };
      sandbox.stub(userMediaModel, 'updateMany').returns({ exec: () => Promise.resolve([])} as any);

      await testService.removeMultipleMediaFromAlbum(
        idsDto,
      );
    });
  });

  describe('saveMediasUploaded()', () => {
    it('should return saved blobs', async () => {
      const userMedia: UserMediaUploadedInterface = {
        blobName: '',
      } as any;
      const mediaBlob: BlobInterface = {
        type: MediaTypeEnum.IMAGE,
      } as any;

      sandbox.stub(mediaUploadService, 'parseNameAndType').resolves(mediaBlob);

      sandbox.stub(userMediaModel, 'findOne').returns({ exec: () => Promise.resolve(null)} as any);
      sandbox.stub(userMediaModel, 'create').resolves(media);

      expect(
        await testService.saveMediasUploaded(
          [userMedia],
          business.id,
          'base',
        ),
      ).to.deep.equal([{
        type: MediaTypeEnum.IMAGE,
        url: 'base',
      }]);
    });
  });
});

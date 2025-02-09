import 'mocha';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as uuid from 'uuid';
import { Query, Model } from 'mongoose';
import { HttpService, Logger } from '@nestjs/common';
import { ProductInterface, ProductsService } from '@pe/subscriptions-sdk/modules';
import {
  SubscriptionMediaService,
  ImageAssessmentTaskService,
  MediaUploadService,
  MediaInfoTaskService,
  AttributeService,
  QueryBuilderEsService,
} from '../../../../src/studio/services';
import { SubscriptionMediaModel } from '../../../../src/studio/models';
import { AttributeFilterDto, SubscriptionMediaDto, SearchMediaDto } from '../../../../src/studio/dto';
import { BuilderPaginationDto } from '../../../../src/studio/dto';
import { MediaTypeEnum, SubscriptionMediaTypeEnum } from '../../../../src/studio/enums';
import { ElasticSearchClient } from '@pe/elastic-kit';
import { SubscriptionMediaMessagesProducer } from "../../../../src/studio/producers";

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('SubscriptionMediaService', () => {
  let sandbox: sinon.SinonSandbox;
  let testService: SubscriptionMediaService;
  let subscriptionMediaModel: Model<SubscriptionMediaModel>;
  let imageAssessmentTaskService: ImageAssessmentTaskService;
  let productsService: ProductsService;
  let mediaUploadService: MediaUploadService;
  let mediaInfoTaskService: MediaInfoTaskService;
  let httpService: HttpService;
  let attributeService: AttributeService;
  let queryBuilderEsService: QueryBuilderEsService;
  let elasticSearchClient: ElasticSearchClient;
  let subscriptionMediaMessagesProducer: SubscriptionMediaMessagesProducer;
  let logger: Logger;

  let queryPopulate: any = {
    populate: (): any => { },
  } as any;
  let querySort: Query<SubscriptionMediaModel[], SubscriptionMediaModel> = {
    sort: (): any => { },
  } as any;
  let querySkip: Query<SubscriptionMediaModel[], SubscriptionMediaModel> = {
    skip: (): any => { },
  } as any;
  let queryLimit: Query<SubscriptionMediaModel[], SubscriptionMediaModel> = {
    limit: (): any => { },
  } as any;

  const subscription: SubscriptionMediaModel = {
    id: uuid.v4(),
    mediaType: MediaTypeEnum.IMAGE,
    name: '',
    url: '',
    remove: (): any => { },
    populate(): any { return this },
    execPopulate(): any { return this },
    filter(): any { return this },
    toObject(): any { return this },
  } as any;

  before(() => {
    subscriptionMediaModel = {
      create: (): any => { },
      find: (): any => { },
      deleteOne: (): any => { },
      findOne: (): any => { },
      findOneAndRemove: (): any => { },
      findOneAndUpdate: (): any => { },
      aggregate: (): any => { },
      remove: (): any => { },
      populate(): any { return this },
      execPopulate(): any { return this },
      limit(): any { return this },
      sort(): any { return this },
    } as any;

    imageAssessmentTaskService = {
      create: (): any => { },
    } as any;

    productsService = {
      getAvailableProducts: (): any => { },
    } as any;

    mediaUploadService = {
      findByIdAndBusiness: (): any => { },
    } as any;

    mediaInfoTaskService = {
      create: (): any => { },
    } as any;

    httpService = {
      post: (): any => { },
    } as any;

    attributeService = {
      findOneByNameAndType: (): any => { },
    } as any;

    queryBuilderEsService = {
      buildQuery: (): any => { },
    } as any;

    elasticSearchClient = {
      search: (): any => { },
    } as any;

    subscriptionMediaMessagesProducer = {
      sendMediaUpsertMessage: (): any => { },
      sendMediaDeletedMessage: (): any => { },
    } as any;

    logger = {
      findByIdAndBusiness: (): any => { },
    } as any;

    testService = new SubscriptionMediaService(
      subscriptionMediaModel,
      productsService,
      mediaUploadService,
      mediaInfoTaskService,
      httpService,
      attributeService,
      queryBuilderEsService,
      elasticSearchClient,
      subscriptionMediaMessagesProducer,
      logger,
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
    it('should create attributeModel', async () => {
      const subscriptionMediaDto: SubscriptionMediaDto = {
        // id: uuid.v4(),
        url: '',
        mediaType: MediaTypeEnum.IMAGE,
        name: '',
        subscriptionType: SubscriptionMediaTypeEnum.free,
        attribute: [],
      } as any;

      sandbox.stub(subscriptionMediaModel, 'findOneAndUpdate').returns(queryPopulate);
      sandbox.stub(queryPopulate, 'populate').returns({ exec: () => Promise.resolve(subscription) });
      sandbox.stub(imageAssessmentTaskService, 'create').resolves();
      sandbox.stub(mediaInfoTaskService, 'create').resolves();

      expect(
        await testService.findByUrlAndUpdateOrInsert(subscriptionMediaDto),
      ).to.eq(subscription);
    });

    it('should throw error while creating attributeModel', async () => {
      const subscriptionMediaDto: SubscriptionMediaDto = {
      } as any;

      sandbox.stub(subscriptionMediaModel, 'findOneAndUpdate').throws({
        code: 123,
        name: 'SomeError',
      });
      const spy: sinon.SinonSpy = sandbox.spy(testService, 'findByUrlAndUpdateOrInsert');
      try {
        await testService.findByUrlAndUpdateOrInsert(subscriptionMediaDto);
      } catch (e) { }
      expect(spy.threw());
    });
  });

  describe('updateById()', () => {
    it('should update subscriptionMediaModel by uuid', async () => {
      sandbox.stub(subscriptionMediaModel, 'findOneAndUpdate').resolves(subscription);

      expect(
        await testService.updateById(subscription.id, {}),
      ).to.eq(subscription);
    });

    it('should throw error', async () => {
      sandbox.stub(subscriptionMediaModel, 'findOneAndUpdate').throws({
        code: 100,
        name: 'SomeOtherError',
      });

      const spy: sinon.SinonSpy = sandbox.spy(testService, 'updateById');
      try {
        await testService.updateById(subscription.id, {});
      } catch (e) { }
      expect(spy.threw());
    });
  });

  describe('findSubscriptionMediaByUserId()', () => {
    it('should find all subscriptionMedia model instances', async () => {
      const product: any = {
        id: uuid.v4(),
        features: {
          name: SubscriptionMediaTypeEnum.free,
        }
      };

      sandbox.stub(productsService, 'getAvailableProducts').resolves([product]);

      sandbox.stub(subscriptionMediaModel, 'find').returns(queryPopulate);
      sandbox.stub(queryPopulate, 'populate').returns(querySort);
      sandbox.stub(querySort, 'sort').returns(querySkip);
      sandbox.stub(querySkip, 'skip').returns(queryLimit);
      sandbox.stub(queryLimit, 'limit').returns({ exec: () => Promise.resolve([subscription])} as any);

      expect(
        await testService.findSubscriptionMediaByUserId(
          uuid.v4(),
          new BuilderPaginationDto(),
          'test',
          'test',
        ),
      ).to.deep.equal([subscription]);
    });
  });

  describe('findSubscriptionMedia()', () => {
    it('should find all subscriptionMedia model instances', async () => {
      sandbox.stub(subscriptionMediaModel, 'find').returns(queryPopulate);
      sandbox.stub(queryPopulate, 'populate').returns(querySort);
      sandbox.stub(querySort, 'sort').returns(querySkip);
      sandbox.stub(querySkip, 'skip').returns(queryLimit);
      sandbox.stub(queryLimit, 'limit').resolves([subscription]);

      expect(
        await testService.findSubscriptionMedia(
          new BuilderPaginationDto(),
        ),
      ).to.deep.equal([subscription]);
    });
  });

  describe('findBySubscriptionType()', () => {
    it('should find all subscriptionMedia model instances', async () => {
      sandbox.stub(subscriptionMediaModel, 'find').returns(queryPopulate);
      sandbox.stub(queryPopulate, 'populate').returns(querySort);
      sandbox.stub(querySort, 'sort').returns(querySkip);
      sandbox.stub(querySkip, 'skip').returns(queryLimit);
      sandbox.stub(queryLimit, 'limit').returns({ exec: () => Promise.resolve([subscription])} as any);

      expect(
        await testService.findBySubscriptionType(
          new BuilderPaginationDto(),
          'free',
        ),
      ).to.deep.equal([subscription]);
    });
  });

  describe('remove()', () => {
    it('should remove subscriptionMedia model', async () => {
      sandbox.stub(subscriptionMediaModel, 'deleteOne').returns({ exec: () => Promise.resolve({ })} as any);
      await testService.remove(subscription);
    });
  });

  describe('findByAttribute()', () => {
    it('should find all subscriptionMedia model instances', async () => {
      sandbox.stub(subscriptionMediaModel, 'find').returns(queryPopulate);
      sandbox.stub(queryPopulate, 'populate').returns(querySort);
      sandbox.stub(querySort, 'sort').returns(querySkip);
      sandbox.stub(querySkip, 'skip').returns(queryLimit);
      sandbox.stub(queryLimit, 'limit').resolves([subscription]);

      expect(
        await testService.findByAttribute(
          new BuilderPaginationDto(),
          'test',
          'test',
        ),
      ).to.deep.equal([subscription]);
    });
  });

  describe('findByMultipleAttributes()', () => {
    it('should find all subscriptionMedia model instances', async () => {
      const filter: AttributeFilterDto = {
        attributes: [],
      } as any;

      sandbox.stub(subscriptionMediaModel, 'find').returns(queryPopulate);
      sandbox.stub(queryPopulate, 'populate').returns(querySort);
      sandbox.stub(querySort, 'sort').returns(querySkip);
      sandbox.stub(querySkip, 'skip').returns(queryLimit);
      sandbox.stub(queryLimit, 'limit').resolves([subscription]);

      expect(
        await testService.findByMultipleAttributes(
          new BuilderPaginationDto(),
          filter,
        ),
      ).to.deep.equal([subscription]);
    });
  });

  describe('searchMedia()', () => {
    it('should find all subscriptionMedia model instances', async () => {
      const filter: SearchMediaDto = {
        name: '',
      } as any;

      sandbox.stub(subscriptionMediaModel, 'find').returns(queryPopulate);
      sandbox.stub(queryPopulate, 'populate').returns(querySort);
      sandbox.stub(querySort, 'sort').returns(querySkip);
      sandbox.stub(querySkip, 'skip').returns(queryLimit);
      sandbox.stub(queryLimit, 'limit').resolves([subscription]);

      expect(
        await testService.searchMedia(
          filter,
        ),
      ).to.deep.equal([subscription]);
    });
  });

  describe('searchMediaByUserId()', () => {
    it('should find all subscriptionMedia model instances', async () => {
      const product: any = {
        id: uuid.v4(),
        features: {
          name: SubscriptionMediaTypeEnum.free,
        }
      };

      const filter: SearchMediaDto = {
        name: '',
      } as any;

      sandbox.stub(productsService, 'getAvailableProducts').resolves([product]);

      sandbox.stub(subscriptionMediaModel, 'find').returns(queryPopulate);
      sandbox.stub(queryPopulate, 'populate').returns(querySort);
      sandbox.stub(querySort, 'sort').returns(querySkip);
      sandbox.stub(querySkip, 'skip').returns(queryLimit);
      sandbox.stub(queryLimit, 'limit').resolves([subscription]);

      expect(
        await testService.searchMediaByUserId(
          uuid.v4(),
          filter,
        ),
      ).to.deep.equal([subscription]);
    });
  });
});

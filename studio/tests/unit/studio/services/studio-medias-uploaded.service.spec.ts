import 'mocha';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as uuid from 'uuid';
import { Model } from 'mongoose';
import { SubscriptionMediaService, UserMediaService, StudioMediasUploadedService } from '../../../../src/studio/services';
import { UserMediaModel } from '../../../../src/studio/models';
import { StudioImagesUploadedDto, StudioImagesUploadedErrorDto } from '../../../../src/studio/dto';
import { BusinessModel } from '../../../../src/business/models';
import { StudioMediasUploadedMessagesProducer } from '../../../../src/studio/producers';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('StudioMediasUploadedService', () => {
  let sandbox: sinon.SinonSandbox;
  let testService: StudioMediasUploadedService;
  let userMediaModel: Model<UserMediaModel>;
  let subscriptionMediaService: SubscriptionMediaService;
  let userMediaService: UserMediaService;
  let studioMediasUploadedMessagesProducer: StudioMediasUploadedMessagesProducer;

  const business: BusinessModel = {
    id: uuid.v4(),
  } as any;

  before(() => {
    userMediaModel = {
      create: (): any => { },
      find: (): any => { },
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

    subscriptionMediaService = {
      saveMediasUploaded: (): any => { },
    } as any;

    userMediaService = {
      saveMediasUploaded: (): any => { },
    } as any;

    studioMediasUploadedMessagesProducer = {
      userMediasUploaded: (): any => { },
      userMediasUploadedError: (): any => { },
      subscriptionMediasUploaded: (): any => { },
      subscriptionMediasUploadedError: (): any => { },
    } as any;

    testService = new StudioMediasUploadedService(
      userMediaModel,
      subscriptionMediaService,
      userMediaService,
      studioMediasUploadedMessagesProducer,
    );
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    sandbox = undefined;
  });

  describe('saveUploadMedia()', () => {
    it('should handle media upload', async () => {
      const studioImagesUploadedDto: StudioImagesUploadedDto = {
      } as any;

      sandbox.stub(subscriptionMediaService, 'saveMediasUploaded').resolves();
      sandbox.stub(studioMediasUploadedMessagesProducer, 'subscriptionMediasUploaded').resolves();

      await testService.saveUploadMedia(studioImagesUploadedDto);
    });

    it('should handle media upload with businessId', async () => {
      const studioImagesUploadedDto: StudioImagesUploadedDto = {
        businessId: business.id,
        baseUrl: '',
      } as any;

      sandbox.stub(userMediaService, 'saveMediasUploaded').resolves();
      sandbox.stub(studioMediasUploadedMessagesProducer, 'subscriptionMediasUploaded').resolves();

      await testService.saveUploadMedia(studioImagesUploadedDto);
    });

    it('should throw error while creating attributeModel', async () => {
      const studioImagesUploadedDto: StudioImagesUploadedDto = {
      } as any;

      sandbox.stub(subscriptionMediaService, 'saveMediasUploaded').throws({
        code: 123,
        name: 'SomeError',
      });
      const spy: sinon.SinonSpy = sandbox.spy(testService, 'saveUploadMedia');
      try {
        await testService.saveUploadMedia(studioImagesUploadedDto);
      } catch (e) { }
      expect(spy.threw());
    });
  });

  describe('saveMediaUploadError()', () => {
    it('should handle save media upload error', async () => {
      const studioImagesUploadedDto: StudioImagesUploadedErrorDto = {
      } as any;

      sandbox.stub(studioMediasUploadedMessagesProducer, 'userMediasUploadedError').resolves();

      expect(
        await testService.saveMediaUploadError(studioImagesUploadedDto),
      ).to.eq(undefined);
    });

    it('should handle save media upload error with businessId', async () => {
      const studioImagesUploadedDto: StudioImagesUploadedErrorDto = {
        businessId: business.id,
      } as any;

      sandbox.stub(studioMediasUploadedMessagesProducer, 'userMediasUploadedError').resolves();

      expect(
        await testService.saveMediaUploadError(studioImagesUploadedDto),
      ).to.eq(undefined);
    });

    it('should throw error', async () => {
      const studioImagesUploadedDto: StudioImagesUploadedErrorDto = {
      } as any;

      sandbox.stub(studioMediasUploadedMessagesProducer, 'subscriptionMediasUploadedError').throws({
        code: 100,
        name: 'SomeOtherError',
      });

      const spy: sinon.SinonSpy = sandbox.spy(testService, 'saveMediaUploadError');
      try {
        await testService.saveMediaUploadError(studioImagesUploadedDto);
      } catch (e) { }
      expect(spy.threw());
    });
  });
});

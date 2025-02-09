import 'mocha';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as uuid from 'uuid';
import { Model } from 'mongoose';
import { SampleGeneratorService } from '../../../../src/studio/services';
import { UserMediaModel } from '../../../../src/studio/models';
import { SampleDataService } from '../../../../src/sample-data/services';
import { SampleUserMediaInterface } from '../../../../src/sample-data/interfaces';
import { BusinessDto } from '../../../../src/business/dto';
import { MediaTypeEnum } from '../../../../src/studio/enums';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('SampleGeneratorService', () => {
  let sandbox: sinon.SinonSandbox;
  let testService: SampleGeneratorService;
  let userMediaModel: Model<UserMediaModel>;
  let sampleDataService: SampleDataService;

  before(() => {
    userMediaModel = {
      create: (): any => { },
      find: (): any => { },
      findOne: (): any => { },
      findOneAndRemove: (): any => { },
      findOneAndUpdate: (): any => { },
      aggregate: (): any => { },
      remove: (): any => { },
      limit(): any { return this },
      sort(): any { return this },
    } as any;

    sampleDataService = {
      getMedia: (): any => { },
    } as any;

    testService = new SampleGeneratorService(userMediaModel, sampleDataService);
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    sandbox = undefined;
  });

  describe('generateUserMediaSample()', () => {
    it('should generate sample media', async () => {
      const businessDto: BusinessDto = {
        _id: uuid.v4(),
        name: 'Test',
        createdAt: '',
      } as any;
      const sampleMedia: SampleUserMediaInterface = {
        _id: uuid.v4(),
        mediaType: MediaTypeEnum.IMAGE,
        name: 'Test',
        url: '',
      } as any;

      sandbox.stub(sampleDataService, 'getMedia').resolves([sampleMedia]);
      sandbox.stub(userMediaModel, 'create').resolves();

      await testService.generateUserMediaSample(businessDto);
    });

    it('should throw error while creating sample media', async () => {
      const businessDto: BusinessDto = {
        _id: uuid.v4(),
        name: 'Test',
        createdAt: '',
      };

      sandbox.stub(sampleDataService, 'getMedia').throws({
        code: 123,
        name: 'SomeError',
      });

      const spy: sinon.SinonSpy = sandbox.spy(testService, 'generateUserMediaSample');
      try {
        await testService.generateUserMediaSample(businessDto);
      } catch (e) { }
      expect(spy.threw());
    });
  });
});

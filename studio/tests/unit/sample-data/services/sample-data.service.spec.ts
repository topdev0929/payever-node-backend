import 'mocha';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as uuid from 'uuid';
import { Model } from 'mongoose';
import { SampleDataService } from '../../../../src/sample-data/services';
import { SampleUserMediaModel } from '../../../../src/sample-data/models';
import { MediaTypeEnum } from '../../../../src/studio/enums';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('SampleDataService', () => {
  let sandbox: sinon.SinonSandbox;
  let testService: SampleDataService;
  let sampleUserMediaModel: Model<SampleUserMediaModel>;

  const media: SampleUserMediaModel = {
    id: uuid.v4(),
    url: 'https://example.com',
    mediaType: MediaTypeEnum.IMAGE,
    name: 'Test',
    business: uuid.v4(),
    map(): any { return this },
    toObject(): any { return this },
  } as any;

  before(() => {
    sampleUserMediaModel = {
      find: (): any => { },
    } as any;

    testService = new SampleDataService(sampleUserMediaModel);
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    sandbox = undefined;
  });

  describe('getMedia()', () => {
    it('should return all media instances', async () => {
      sandbox.stub(sampleUserMediaModel, 'find').returns({ exec: () => Promise.resolve([media]) } as any);

      expect(
        await testService.getMedia(),
      ).to.deep.equal([media]);
    });
  });
});

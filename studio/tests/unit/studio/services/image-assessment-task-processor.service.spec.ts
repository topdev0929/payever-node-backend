import 'mocha';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as uuid from 'uuid';
import { ImageAssessmentTaskProcessorService, ImageAssessmentTaskService, ImageAssessmentService } from '../../../../src/studio/services';
import { MediaOwnerTypeEnum, TaskStatusEnum } from '../../../../src/studio/enums';
import { ImageAssessmentTaskModel } from '../../../../src/studio/models';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('ImageAssessmentTaskProcessorService', () => {
  let sandbox: sinon.SinonSandbox;
  let testService: ImageAssessmentTaskProcessorService;
  let taskService: ImageAssessmentTaskService;
  let imageAssessmentService: ImageAssessmentService;
  let imageAssessmentTaskService: ImageAssessmentTaskService;

  before(() => {
    taskService = {
      findWaitingTask: (): any => { },
    } as any;

    imageAssessmentService = {
      runTask: (): any => { },
    } as any;

    imageAssessmentTaskService = {
      findWaitingTask: (): any => { },
      setProcessing: (): any => { },
    } as any;

    testService = new ImageAssessmentTaskProcessorService(imageAssessmentService, imageAssessmentTaskService);
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
      const task: ImageAssessmentTaskModel = {
        mediaId: uuid.v4(),
        status: TaskStatusEnum.processing,
        tries: 1,
        type: MediaOwnerTypeEnum.USER,
        url: '',
      } as any;

      sandbox.stub(imageAssessmentTaskService, 'findWaitingTask').resolves([task]);
      sandbox.stub(imageAssessmentTaskService, 'setProcessing').resolves();
      sandbox.stub(imageAssessmentService, 'runTask').resolves();

      await testService.processTask();
    });

    it('should throw error while creating sample media', async () => {
      sandbox.stub(taskService, 'findWaitingTask').throws({
        code: 123,
        name: 'SomeError',
      });

      const spy: sinon.SinonSpy = sandbox.spy(testService, 'processTask');
      try {
        await testService.processTask();
      } catch (e) { }
      expect(spy.threw());
    });
  });
});

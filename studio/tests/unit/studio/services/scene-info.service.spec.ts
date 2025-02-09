import 'mocha';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as uuid from 'uuid';
import { Query, Model } from 'mongoose';
import { Logger } from '@nestjs/common';
import { ObjectDetectionService, SceneInfoService } from '../../../../src/studio/services';
import { SceneInfoModel } from '../../../../src/studio/models';
import { UpdateSceneInfoDto, GetSceneInfoDto } from '../../../../src/studio/dto';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('SceneInfoService', () => {
  let sandbox: sinon.SinonSandbox;
  let testService: SceneInfoService;
  let sceneInfoModel: Model<SceneInfoModel>;
  let objectDetectionService: ObjectDetectionService;
  let logger: Logger;

  let querySelect: Query<SceneInfoModel[], SceneInfoModel> = {
    select: (): any => { },
  } as any;
  let querySort: Query<SceneInfoModel[], SceneInfoModel> = {
    sort: (): any => { },
  } as any;
  let querySkip: Query<SceneInfoModel[], SceneInfoModel> = {
    skip: (): any => { },
  } as any;
  let queryLimit: Query<SceneInfoModel[], SceneInfoModel> = {
    limit: (): any => { },
  } as any;

  const id = uuid.v4();
  const scene: SceneInfoModel = {
    _id: id,
    id: id,
    remove: (): any => { },
    select(): any { return this },
    filter(): any { return this },
    toObject(): any { return this },
  } as any;

  before(() => {
    sceneInfoModel = {
      create: (): any => { },
      find: (): any => { },
      deleteOne: (): any => { },
      findOne: (): any => { },
      findOneAndRemove: (): any => { },
      findOneAndUpdate: (): any => { },
      aggregate: (): any => { },
      remove: (): any => { },
      select(): any { return this },
      limit(): any { return this },
      sort(): any { return this },
    } as any;

    objectDetectionService = {
      filterAttributeByFilterAbleOnly: (): any => { },
    } as any;

    logger = {
      log: (): any => { },
    } as any;

    testService = new SceneInfoService(sceneInfoModel, objectDetectionService, logger);
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    sandbox = undefined;
  });

  describe('update()', () => {
    it('should update userAlbumModel by uuid', async () => {
      const sceneInfoDto: UpdateSceneInfoDto = {
        id: uuid.v4(),
      } as any;

      sandbox.stub(sceneInfoModel, 'findOneAndUpdate').resolves(scene);

      expect(
        await testService.update(scene.id, sceneInfoDto),
      ).to.eq(scene);
    });

    it('should throw error', async () => {
      const sceneInfoDto: UpdateSceneInfoDto = {
        id: uuid.v4(),
      } as any;

      sandbox.stub(sceneInfoModel, 'findOneAndUpdate').throws({
        code: 100,
        name: 'SomeOtherError',
      });

      const spy: sinon.SinonSpy = sandbox.spy(testService, 'update');
      try {
        await testService.update(scene.id, sceneInfoDto);
      } catch (e) { }
      expect(spy.threw());
    });
  });

  describe('remove()', () => {
    it('should remove scene', async () => {
      sandbox.stub(sceneInfoModel, 'deleteOne').returns({ exec: () => Promise.resolve({ })} as any);

      await testService.remove(scene);
    });
  });

  describe('findByVideo()', () => {
    it('should find an scene model instance', async () => {
      const getSceneInfoDto: GetSceneInfoDto = {
        video: '',
      } as any;

      sandbox.stub(sceneInfoModel, 'find').returns(querySort);
      sandbox.stub(querySort, 'sort').returns(querySkip);
      sandbox.stub(querySkip, 'skip').returns(queryLimit);
      sandbox.stub(queryLimit, 'limit').resolves([scene]);

      expect(
        await testService.findByVideo(getSceneInfoDto),
      ).to.deep.equal([scene]);
    });
  });

  describe('findIdsByVideoAndFrames()', () => {
    it('should find an scene model instance', async () => {
      sandbox.stub(sceneInfoModel, 'find').returns(querySelect);
      sandbox.stub(querySelect, 'select').returns({ exec: () => Promise.resolve([scene]) } as any);

      expect(
        await testService.findIdsByVideoAndFrames([], ''),
      ).to.deep.equal([scene.id]);
    });
  });

  describe.skip('generateSceneInfo()', () => {
  });

  describe('getScenePool()', () => {
    it('should find an scene model instance', async () => {
      sandbox.stub(sceneInfoModel, 'find').resolves([scene]);

      expect(
        await testService.getScenePool([]),
      ).to.deep.equal([scene]);
    });
  });
});

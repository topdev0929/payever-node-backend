import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import 'mocha';
import { Model } from 'mongoose';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import { PushNotificationDto } from '../../../../src/widget/dto';
import { PushNotificationModel } from '../../../../src/widget/models';
import { PushNotificationService } from '../../../../src/widget/services/push-notification.service';

chai.use(sinonChai);
chai.use(chaiAsPromised);

const expect: Chai.ExpectStatic = chai.expect;

describe('PushNotificationService', () => {
  let sandbox: sinon.SinonSandbox;
  let pushNotificationModel: Model<PushNotificationModel>;
  let testService: PushNotificationService;

  const pushNotificationModelInstance: PushNotificationModel = {
    'message': 'Hi there!',
  } as PushNotificationModel;

  before(() => {
    pushNotificationModel = {
      countDocuments: (): any => { },
      create: (): any => { },
      delete: (): any => { },
      find: (): any => { },
      findOne: (): any => { },
      findOneAndUpdate: (): any => { },
    } as any;


    testService = new PushNotificationService(
      pushNotificationModel,
      null,
    );
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    sandbox = undefined;
  });

  describe('Admin CRUD', () => {
    it('should return a list of pushNotificationModel instances', async () => {
      sandbox.stub(pushNotificationModel, 'find').resolves([pushNotificationModelInstance]);
      const result: PushNotificationDto[] = await testService.getAll();
      expect(result).to.deep.equal([pushNotificationModelInstance]);
    });

    it('should create and return an pushNotificationModel instance', async () => {
      sandbox.stub(pushNotificationModel, 'countDocuments').resolves(0);
      sandbox.stub(pushNotificationModel, 'create').resolves(pushNotificationModelInstance);
      const result: PushNotificationDto = await testService.create(pushNotificationModelInstance);
      expect(result).to.deep.equal(pushNotificationModelInstance);
    });

    it('should update and return an onboarding instance', async () => {
      const newMessage: string = 'Welcome.';
      const updatedInstance: PushNotificationModel = Object.assign({ }, pushNotificationModelInstance);
      updatedInstance.message = newMessage;

      sandbox.stub(pushNotificationModel, 'findOneAndUpdate').resolves(updatedInstance);
      const result: PushNotificationDto = await testService.update(
        pushNotificationModelInstance._id,
        pushNotificationModelInstance,
      );
      expect(result).to.deep.equal(updatedInstance);
    });

  });
});

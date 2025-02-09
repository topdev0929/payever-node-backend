import { RabbitMqClient } from '@pe/nest-kit';
import { describe, it } from 'mocha';
import { model, Model } from 'mongoose';
import 'reflect-metadata';
import { mock, SinonMock } from 'sinon';
import 'sinon-mongoose';
import { createDto, createStubService } from '../../../test/test-misc';
import { RegisterAppDto } from '../dto/register-app.dto';
import { AppModel } from '../interfaces/app.model';
import { AppSchema } from '../schemas/apps.schema';
import { AppsService } from './apps.service';

describe(AppsService.name, () => {
  let appsService: AppsService;
  let appModel: SinonMock;
  let rabbitmqClient: SinonMock;

  beforeEach(() => {
    const app: Model<AppModel> = model<AppModel>('app', AppSchema);
    const rc: RabbitMqClient = createStubService<RabbitMqClient>();
    appsService = new AppsService(app, rc);
    appModel = mock(app);
    rabbitmqClient = mock(rc);
  });

  describe('create', () => {
    it('should create new app', async () => {
      appModel.expects('findOneAndUpdate').resolves(null);

      const app: object = {
        _id: 'b0528d27-d8b6-4a95-aff3-2b994451f984',
        code: 'connect',
      };
      appModel.expects('create').resolves({ toObject: (): object => app });

      rabbitmqClient.expects('send').withArgs(
        {
          channel: `app-registry.event.dashboard.application.created`,
          exchange: 'async_events',
        },
        {
          name: `app-registry.event.dashboard.application.created`,
          payload: {
            ...app,
          },
        },
      );

      const dto: RegisterAppDto = await createDto(RegisterAppDto, {
        code: 'connect',
      });
      await appsService.create(dto);

      appModel.verify();
      rabbitmqClient.verify();
    });

    it('should update existing app', async () => {
      const app: object = {
        _id: 'b0528d27-d8b6-4a95-aff3-2b994451f984',
        code: 'connect',
      };
      appModel.expects('findOneAndUpdate').resolves({ toObject: (): object => app });

      rabbitmqClient.expects('send').withArgs(
        {
          channel: `app-registry.event.dashboard.application.updated`,
          exchange: 'async_events',
        },
        {
          name: `app-registry.event.dashboard.application.updated`,
          payload: {
            ...app,
          },
        },
      );

      const dto: RegisterAppDto = await createDto(RegisterAppDto, {
        code: 'connect',
      });
      await appsService.create(dto);

      appModel.verify();
      rabbitmqClient.verify();
    });
  });
});

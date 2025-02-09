import * as path from 'path';
import * as http from 'http';
import { AddressInfo } from 'net';

import * as express from 'express';
import { Model } from 'mongoose';
import { PactFactory } from 'nestjs-pact';

import { TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Pact } from '@pact-foundation/pact';

import { PePact } from '@pe/pact-kit';

import { environment } from '../../../src/environments';
import { TaskExecutor } from '../../../src/onboarding/services';
import { TaskDocument, Task } from '../../../src/onboarding/schemas';

import { TASK_ID, BUSINESS_ID, OLD_TOKEN_EXAMPLE } from './const';
import { ProvidersEnum } from './provider.enum';
import {
  AuthInterations,
  CommerceosInterations,
  MediaInteractions,
  UsersInteractions,
  ConnectInteractions,
  QrInteractions,
  PosInteractions,
  WallpapersInteractions,
  CheckoutInteractions,
  DevicePaymentsInteractions,
  PaymentThirdPartyInteractions,
  CommunicationsThirdPartyInteractions,
} from './interactions';

import { ObjectMerger } from '../../../src/onboarding/helpers/object.merger';
import { ApplicationModule } from '../../../src/app.module';
import { PactConsumerConfigOptionsService } from '../pact-consumer-config-options.service';
import { pactEnvConfig } from '../config';

import * as taskPrototypeJSON from './../../../features/fixtures/task.json';

describe('onboarding features', function(): void {
  if (process.env.DEBUG) { this.timeout(60 * 1000); }
  const consumer: string = pactEnvConfig.provider.provider;
  let authProvider: Pact;
  let commerceOsProvider: Pact;
  let mediaProvider: Pact;
  let usersProvider: Pact;
  let checkoutProvider: Pact;
  let wallpapersProvider: Pact;
  let posProvider: Pact;
  let connectProvider: Pact;
  let qrProvider: Pact;
  let devicePaymentsProvider: Pact;
  let communicationsThirPartyProvider: Pact;
  let paymentsThirdPartyProvider: Pact;

  let taskExecutor: TaskExecutor;
  let taskModel: Model<TaskDocument>;

  before(async () => {
    const staticApp: express.Express = express();
    staticApp.use(express.static(path.resolve(__dirname, 'static')));
    const server: http.Server = staticApp.listen();
    const address: AddressInfo = server.address() as AddressInfo;

    const taskPrototype: Task = ObjectMerger.merge(
      taskPrototypeJSON,
      {
        incomingData: {
          business: {
            currentWallpaper: {
              wallpaper: `http://localhost:${address.port}/small.jpg`,
            },
            logo: `http://localhost:${address.port}/small.jpg`,
          },
          checkout: {
            logo: `http://localhost:${address.port}/small.jpg`,
          },
        },
      },
    );

    environment.processorDelayMs = 1;

    const [testingModule, pactFactory]: [TestingModule, PactFactory] =
      await PePact.getConsumer(ApplicationModule, PactConsumerConfigOptionsService, { });

    authProvider = pactFactory.createContractBetween({ consumer, provider: ProvidersEnum.Auth });
    commerceOsProvider = pactFactory.createContractBetween({ consumer, provider: ProvidersEnum.Commerceos });
    mediaProvider = pactFactory.createContractBetween({ consumer, provider: ProvidersEnum.Media });
    usersProvider = pactFactory.createContractBetween({ consumer, provider: ProvidersEnum.Users });
    checkoutProvider = pactFactory.createContractBetween({ consumer, provider: ProvidersEnum.Checkout });
    wallpapersProvider = pactFactory.createContractBetween({ consumer, provider: ProvidersEnum.Wallpapers });
    posProvider = pactFactory.createContractBetween({ consumer, provider: ProvidersEnum.Pos });
    connectProvider = pactFactory.createContractBetween({ consumer, provider: ProvidersEnum.Connect });
    qrProvider = pactFactory.createContractBetween({ consumer, provider: ProvidersEnum.Qr });
    devicePaymentsProvider = pactFactory.createContractBetween({ consumer, provider: ProvidersEnum.DevicePayments });
    communicationsThirPartyProvider =
      pactFactory.createContractBetween({ consumer, provider: ProvidersEnum.CommunicationsThirdParty });
    paymentsThirdPartyProvider =
      pactFactory.createContractBetween({ consumer, provider: ProvidersEnum.PaymentsThirdParty });

    taskExecutor = testingModule.get<TaskExecutor>(TaskExecutor);
    taskModel = testingModule.get(getModelToken(Task.name));

    await taskModel.create({
      ...taskPrototype,
      _id: TASK_ID,
      businessId: BUSINESS_ID,
      token: OLD_TOKEN_EXAMPLE,
    });

    await authProvider.setup();
    environment.microservices.authUrl = `http://localhost:${authProvider.opts.port}`;
    await commerceOsProvider.setup();
    environment.microservices.commerceosUrl = `http://localhost:${commerceOsProvider.opts.port}`;
    await mediaProvider.setup();
    environment.microservices.mediaUrl = `http://localhost:${mediaProvider.opts.port}`;
    await usersProvider.setup();
    environment.microservices.usersUrl = `http://localhost:${usersProvider.opts.port}`;
    await checkoutProvider.setup();
    environment.microservices.checkoutUrl = `http://localhost:${checkoutProvider.opts.port}`;
    await wallpapersProvider.setup();
    environment.microservices.wallpapersUrl = `http://localhost:${wallpapersProvider.opts.port}`;
    await posProvider.setup();
    environment.microservices.posUrl = `http://localhost:${posProvider.opts.port}`;
    await connectProvider.setup();
    environment.microservices.connectUrl = `http://localhost:${connectProvider.opts.port}`;
    await qrProvider.setup();
    environment.microservices.qrUrl = `http://localhost:${qrProvider.opts.port}`;
    await devicePaymentsProvider.setup();
    environment.microservices.devicePaymentsUrl = `http://localhost:${devicePaymentsProvider.opts.port}`;
    await communicationsThirPartyProvider.setup();
    environment.microservices.communicationsThirdPartyUrl = `http://localhost:${communicationsThirPartyProvider.opts.port}`;
    await paymentsThirdPartyProvider.setup();
    environment.microservices.paymentThirdPartyUrl = `http://localhost:${paymentsThirdPartyProvider.opts.port}`;
  });

  after(async () => {
    await authProvider.finalize();
    await commerceOsProvider.finalize();
    await mediaProvider.finalize();
    await usersProvider.finalize();
    await checkoutProvider.finalize();
    await wallpapersProvider.finalize();
    await posProvider.finalize();
    await connectProvider.finalize();
    await qrProvider.finalize();
    await devicePaymentsProvider.finalize();
    await communicationsThirPartyProvider.finalize();
    await paymentsThirdPartyProvider.finalize();
  });

  afterEach(() => Promise.all([
    authProvider.verify(),
    commerceOsProvider.verify(),
    mediaProvider.verify(),
    usersProvider.verify(),
    checkoutProvider.verify(),
    wallpapersProvider.verify(),
    posProvider.verify(),
    connectProvider.verify(),
    qrProvider.verify(),
    devicePaymentsProvider.verify(),
    communicationsThirPartyProvider.verify(),
    paymentsThirdPartyProvider.verify(),
  ]));

  describe('task processing', async () => {
    before(async () => {
      await authProvider.addInteraction(AuthInterations.GrantBusinessAccessInteraction());
      await commerceOsProvider.addInteraction(CommerceosInterations.GetOnboardingInteraction());
      await commerceOsProvider.addInteraction(CommerceosInterations.ToggleAppsInstalledInteraction());
      await mediaProvider.addInteraction(MediaInteractions.UploadMediaFile());
      await usersProvider.addInteraction(UsersInteractions.CreateBusinessTransaction());
      await checkoutProvider.addInteraction(CheckoutInteractions.GetCheckoutsInteraction());
      await checkoutProvider.addInteraction(CheckoutInteractions.SetSettingsInteraction());
      await checkoutProvider.addInteraction(CheckoutInteractions.SetIntegrationsInteraction());
      await wallpapersProvider.addInteraction(WallpapersInteractions.SetWallpaperInteraction());
      await posProvider.addInteraction(PosInteractions.GetTerminalsInteraction());
      await posProvider.addInteraction(PosInteractions.SetIntegrationToTerminalInteraction());
      await connectProvider.addInteraction(ConnectInteractions.InstallConnectAppsIneraction());
      await qrProvider.addInteraction(QrInteractions.SetupQrInteraction());
      await devicePaymentsProvider.addInteraction(DevicePaymentsInteractions.DevicePaymentsSetup());
      await communicationsThirPartyProvider.addInteraction(
        CommunicationsThirdPartyInteractions.TwilioSetupInteraction(),
      );
      await paymentsThirdPartyProvider.addInteraction(PaymentThirdPartyInteractions.SantanderFormConnectInteraction());
      await paymentsThirdPartyProvider.addInteraction(PaymentThirdPartyInteractions.SantanderFormSaveInteraction());
    });
    it('should process all http requests across onboarding task processing', async () => {
      const task: TaskDocument = await taskModel.findById(TASK_ID);
      await taskExecutor.execute(task);
    });
  });
});

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EventDispatcherModule,
} from '@pe/nest-kit';


import {
  ConnectionService,
  SettingsFormBuilder,
} from './services';
import {
  ConnectionController,
  IntegrationController,
  SettingsController,
} from './controllers';
import {
  ConnectionBusMessageController,
} from './consumers';
import {
  ConnectionSchema,
  ConnectionSchemaName,
  IntegrationSchema,
  IntegrationSchemaName,
} from './schemas';
import { IntegrationService } from './services/integration.service';

@Module({
  controllers: [
    SettingsController,
    ConnectionBusMessageController,
    ConnectionController,
    IntegrationController,
  ],
  imports: [
    EventDispatcherModule,
    MongooseModule.forFeature([
      { name: ConnectionSchemaName, schema: ConnectionSchema },
      {
        name: IntegrationSchemaName,
        schema: IntegrationSchema,
      },
    ]),
  ],
  providers: [
    ConnectionService,
    SettingsFormBuilder,
    IntegrationService,
  ],
})

export class IntegrationModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}

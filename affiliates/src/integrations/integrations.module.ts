import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EventDispatcherModule,
} from '@pe/nest-kit';


import {
  ConnectionService,
} from './services';
import {
  ConnectionController,
  IntegrationController,
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
    IntegrationService,
  ],
})

export class IntegrationModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}

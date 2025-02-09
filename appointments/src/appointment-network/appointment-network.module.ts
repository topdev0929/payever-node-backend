import { HttpModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventDispatcherModule } from '@pe/nest-kit';
import {
  AppointmentNetworkController,
  AccessController,
  DomainController,
} from './controllers';
import {
  AccessConfigService,
  AppointmentNetworkService,
  DomainService,
} from './services';
import {
  AppointmentNetworkSchemaName,
  AppointmentNetworkSchema,
  AccessConfigSchema, 
  AccessConfigSchemaName,
  DomainSchema,
  DomainSchemaName,
} from './schemas';
import { AppointmentNetworkMessagesProducer } from './producers';
import { AppointmentNetworkEventsListener } from './event-listeners';
import { AdminAppointmentNetworkController } from './controllers/admin-appointment-network.controller';

@Module({
  controllers: [
    AppointmentNetworkController,
    AccessController,
    DomainController,
    AdminAppointmentNetworkController,
  ],
  imports: [
    HttpModule,
    EventDispatcherModule,
    MongooseModule.forFeature([
      { name: AccessConfigSchemaName, schema: AccessConfigSchema },
      { name: AppointmentNetworkSchemaName, schema: AppointmentNetworkSchema },
      { name: DomainSchemaName, schema: DomainSchema },
    ]),
  ],
  providers: [
    // Services
    AccessConfigService,
    AppointmentNetworkService,
    DomainService,
    // Producers
    AppointmentNetworkMessagesProducer,
    // Listeners
    AppointmentNetworkEventsListener,
  ],
})
export class AppointmentNetworkModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}

// tslint:disable: object-literal-sort-keys
import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateDefaultAvailabilityCommand } from './commands';
import { BusinessListener } from './event-listeners';
import { AppointmentAvailabilityResolver } from './graphql';
import { AppointmentAvailabilitySchemaName, AppointmentAvailabilitySchema } from './schemas';
import { AppointmentAvailabilityService } from './services';


@Module({
  controllers: [
  ],
  exports: [
   
  ],
  imports: [
    HttpModule,
    MongooseModule.forFeature([{
      name: AppointmentAvailabilitySchemaName,
      schema: AppointmentAvailabilitySchema,
    }]),
  ],
  providers: [
    AppointmentAvailabilityService,
    AppointmentAvailabilityResolver,
    BusinessListener,
    CreateDefaultAvailabilityCommand,
  ],
})
export class AppointmentAvailabilityModule { }

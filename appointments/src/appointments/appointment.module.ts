// tslint:disable: object-literal-sort-keys
import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BusinessModule } from '@pe/business-kit';
import { FoldersPluginModule } from '@pe/folders-plugin';
import { RulesSdkModule } from '@pe/rules-sdk';
import { BuilderAppointmentController, AppointmentsController } from './controllers';
import { AppointmentsExportCommand } from './commands';
import { RabbitChannelsEnum, RabbitExchangesEnum } from './enums';
import { AppointmentEventsListener, BusinessEventsListener } from './event-listeners';
import { AppointmentFieldResolver, AppointmentResolver, FieldsResolver } from './graphql/resolvers';
import { AppointmentFieldModelService, AppointmentModelService, FieldModelService } from './models-services';
import { AppointmentEventsProducer } from './producers';
import {
  AppointmentFieldSchema,
  AppointmentFieldSchemaName,
  AppointmentSchema,
  AppointmentSchemaName,
  FieldSchema,
  FieldSchemaName,
} from './schemas';
import { AppointmentFieldService, AppointmentService, ElasticSearchService, FieldService } from './services';
import { CreateContactsRequestProducer } from './producers/create-contacts-request.producer';
import { FoldersConfig, RulesOptions } from './config';
import { AdminAppointmentsController } from './controllers/admin-appointments.controller';
import { AppointmentTypeModule } from '../appointment-types';
import { AppointmentAvailabilityModule } from '../appointment-availability';

@Module({
  controllers: [
    AppointmentsController,
    BuilderAppointmentController,
    AdminAppointmentsController,
  ],
  exports: [
    AppointmentFieldService,
    AppointmentService,
  ],
  imports: [
    AppointmentTypeModule,
    AppointmentAvailabilityModule,
    HttpModule,
    MongooseModule.forFeature([{
      name: AppointmentFieldSchemaName,
      schema: AppointmentFieldSchema,
    }, {
      name: AppointmentSchemaName,
      schema: AppointmentSchema,
    }, {
      name: FieldSchemaName,
      schema: FieldSchema,
    }]),

    BusinessModule.forRoot({
      rabbitChannel: RabbitChannelsEnum.Appointments,
    }),
    FoldersPluginModule.forFeature(FoldersConfig),
    RulesSdkModule.forRoot(RulesOptions),
  ],
  providers: [
    // Export command
    AppointmentsExportCommand,
    // Producer
    AppointmentEventsProducer,
    // Event listeners
    BusinessEventsListener,
    AppointmentEventsListener,
    // Resolvers
    AppointmentFieldResolver,
    AppointmentResolver,
    FieldsResolver,
    // Model services
    AppointmentFieldModelService,
    AppointmentModelService,
    FieldModelService,
    // Services
    AppointmentFieldService,
    AppointmentService,
    ElasticSearchService,
    FieldService,
    CreateContactsRequestProducer,
  ],
})
export class AppointmentModule { }

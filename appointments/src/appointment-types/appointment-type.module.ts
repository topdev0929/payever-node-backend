// tslint:disable: object-literal-sort-keys
import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentTypeResolver } from './graphql';
import { AppointmentTypeSchemaName, AppointmentTypeSchema } from './schemas';
import { AppointmentTypeService } from './services';


@Module({
  controllers: [
  ],
  exports: [
   
  ],
  imports: [
    HttpModule,
    MongooseModule.forFeature([{
      name: AppointmentTypeSchemaName,
      schema: AppointmentTypeSchema,
    }]),
  ],
  providers: [
    AppointmentTypeService,
    AppointmentTypeResolver,
  ],
})
export class AppointmentTypeModule { }

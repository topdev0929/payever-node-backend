import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessStepController, DefaultStepController } from './controllers';
import { BusinessStepSchema, BusinessStepSchemaName, DefaultStepSchema, DefaultStepSchemaName } from './schemas';
import { BusinessStepService, DefaultStepService } from './services';
import { BusinessEventsListener } from './event-listeners';

@Module({
  controllers: [
    DefaultStepController,
    BusinessStepController,
  ],
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      {
        name: BusinessStepSchemaName,
        schema: BusinessStepSchema,
      },
      {
        name: DefaultStepSchemaName,
        schema: DefaultStepSchema,
      },
    ]),
  ],
  providers: [
    DefaultStepService,
    BusinessStepService,
    BusinessEventsListener,
  ],
})
export class StepperModule { }

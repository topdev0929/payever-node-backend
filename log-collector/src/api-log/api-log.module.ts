import { Module } from '@nestjs/common';
import { ApiLogSchema, ApiLogSchemaName } from './schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiLogController, ApiLogMessageBusController } from './controllers';
import { ApiLogService } from './services';

@Module({
  controllers: [
    ApiLogMessageBusController,
    ApiLogController,
  ],
  imports: [
    MongooseModule.forFeature([
      { name: ApiLogSchemaName, schema: ApiLogSchema },
    ]),
  ],
  providers: [
    ApiLogService,
  ],
})
export class ApiLogModule { }

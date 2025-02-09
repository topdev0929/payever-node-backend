import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StorageController } from './controllers/record.controller';
import { RemoveOutdatedRecordsHandler } from './cron-handlers/remove-outdated-records.handler';
import { RecordSchema, RecordSchemaName } from './schemas/record.schema';
import { RecordService } from './services/record.service';

@Module({
  controllers: [
    StorageController,
  ],
  exports: [],
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      {
        name: RecordSchemaName,
        schema: RecordSchema,
      },
    ]),
  ],
  providers: [
    RecordService,
    RemoveOutdatedRecordsHandler,
  ],
})
export class StorageModule { }

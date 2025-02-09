import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SampleUserMediaSchema, SampleUserMediaSchemaName } from './schemas';
import { SampleDataService } from './services';

@Module({
  controllers: [
  ],
  exports: [
    SampleDataService,
  ],
  imports: [
    HttpModule,
    MongooseModule.forFeature(
      [
        { name: SampleUserMediaSchemaName, schema: SampleUserMediaSchema },
      ],
    ),
  ],
  providers: [
    SampleDataService,
  ],
})

export class SampleDataModule { }

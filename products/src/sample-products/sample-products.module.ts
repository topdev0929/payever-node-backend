import { HttpModule, Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AdminSampleProductsController } from './controllers';
import { SampleProductEventsListener } from './event-listeners';
import { SampleProductsEventsProducer } from './producers';
import { SampleProductsService } from './services';
import { SampleProductSchema, SampleProductSchemaName } from './schemas';

@Module({
  controllers: [
    AdminSampleProductsController,
  ],
  exports: [
    SampleProductsEventsProducer,
    SampleProductEventsListener,
    SampleProductsService,
  ],
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: SampleProductSchemaName, schema: SampleProductSchema }]),
  ],
  providers: [
    SampleProductsEventsProducer,
    SampleProductEventsListener,
    SampleProductsService,
  ],
})
export class SampleProductsModule implements NestModule {
  constructor(private readonly logger: Logger) { }

  public configure(consumer: MiddlewareConsumer): void { }
}

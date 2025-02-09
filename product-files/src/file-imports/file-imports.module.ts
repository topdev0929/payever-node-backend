import { HttpModule, Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { FileImportsService, ImportEventsService } from './service';
import { FileProcessorModule } from '../file-processor/file-processor.module';
import { SynchronizationTasksController, SynchronizerMessageBusController } from './controllers';

@Module({
  controllers: [
    SynchronizerMessageBusController,
    SynchronizationTasksController,
  ],
  imports: [
    HttpModule,
    FileProcessorModule,
  ],
  providers: [
    FileImportsService,
    ImportEventsService,
  ],
})
export class FileImportsModule implements NestModule {
  constructor(private readonly logger: Logger) { }

  public configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void { }
}

import { Module, DynamicModule } from '@nestjs/common';

import { ElasticIndexProducer } from './producers';
import { MessageElasticService } from './services';
import { PlatformModule } from '../platform';
import { MessagesEsExportCommand } from './commands';

@Module({ })
export class SearchMessagesModule {
  public static forRoot(options: { }): DynamicModule {
    return {
      module: SearchMessagesModule,

      exports: [
        MessageElasticService,
      ],
      imports: [
        PlatformModule,
      ],
      providers: [
        MessagesEsExportCommand,
        ElasticIndexProducer,
        MessageElasticService,
      ],
    };
  }
}


import { Module } from '@nestjs/common';

import { SynchronizationTasksHttpController } from './controllers';
import { SynchronizerModule } from '../synchronizer';
import { ControllerHandlerService } from './services';

@Module({
  controllers: [
    SynchronizationTasksHttpController,
  ],
  imports: [
    SynchronizerModule,
  ],
  providers: [
    ControllerHandlerService,
  ],
})
export class MerchantModule { }

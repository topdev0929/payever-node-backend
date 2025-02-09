import { Module } from '@nestjs/common';

import { ContactFilesBusMessageController } from './consumers';
import { SynchronizerModule } from '../synchronizer';
import { ConsumerHandlerService } from './services';

@Module({
  controllers: [
    ContactFilesBusMessageController,
  ],
  imports: [
    SynchronizerModule,
  ],
  providers: [
    ConsumerHandlerService,
  ],
})
export class FilesModule { }

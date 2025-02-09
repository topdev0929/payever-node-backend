import { Module } from '@nestjs/common';
import { ActionsController } from './controllers';
import { ActionsRetrieverService } from './services';

@Module({
  controllers: [ActionsController],
  exports: [],
  imports: [],
  providers: [ActionsRetrieverService],
})
export class TransactionActionsModule { }

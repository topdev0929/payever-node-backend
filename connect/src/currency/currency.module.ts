import { HttpModule, Logger, Module } from '@nestjs/common';

import { CurrencyController } from './controllers';

@Module({
  controllers: [CurrencyController],
  exports: [],
  imports: [
    HttpModule,
    Logger,
  ],
  providers: [
    Logger,
  ],
})
export class CurrencyModule { }

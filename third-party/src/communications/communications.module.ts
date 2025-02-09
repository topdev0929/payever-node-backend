import { HttpModule, Module } from '@nestjs/common';

import { BusinessModule } from '../business/business.module';
import { IntegrationModule } from '../third-party/integration.module';
import { CommunicationsApiController, CommunicationsInboundController } from './controllers';
import { CommunicationsApiService } from './services/communications-api-service';

@Module({
  controllers: [
    CommunicationsApiController,
    CommunicationsInboundController,
  ],
  imports: [
    HttpModule,
    BusinessModule,
    IntegrationModule,
  ],
  providers: [
    CommunicationsApiService,
  ],
})
export class CommunicationsModule { }

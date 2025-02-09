import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { IntegrationLinkService } from './services';
import { IntegrationLinkSchema, IntegrationLinkSchemaName } from './schemas';
import { PlatformModule } from '../platform';

@Module({
  exports: [
    IntegrationLinkService,
  ],
  imports: [
    MongooseModule.forFeature([{
      name: IntegrationLinkSchemaName,
      schema: IntegrationLinkSchema,
    }]),
    PlatformModule,
  ],
  providers: [
    IntegrationLinkService,
  ],
})
export class IntegrationLinkModule { }

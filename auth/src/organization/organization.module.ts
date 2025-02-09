import { HttpModule, Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OAuthModule } from '../oauth/oauth.module';

import { AdminController, OrganizationController } from './controllerts';
import { OrganizationEventProducer } from './producers';
import {
  OrganizationSchema,
  OrganizationSchemaName,
} from './schemas';
import { OrganizationService } from './services';

@Module({
  controllers: [
    AdminController,
    OrganizationController,
  ],
  exports: [
    OrganizationService,
  ],
  imports: [
    HttpModule,
    MongooseModule.forFeature(
      [
        { name: OrganizationSchemaName, schema: OrganizationSchema },
      ],
    ),
    forwardRef(() => OAuthModule),
  ],
  providers: [
    OrganizationEventProducer,
    OrganizationService,
  ],
})
export class OrganizationModule { }

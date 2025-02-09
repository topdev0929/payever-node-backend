import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { IntercomModule } from '@pe/nest-kit';
import { OrganizationConsumer } from './consumers';
import { PSPController } from './controllers';
import {
  OrganizationBusinessSchema,
  OrganizationBusinessSchemaName,
  OrganizationSchema,
  OrganizationSchemaName,
} from './schemas';
import {
  OrganizationService,
  PSPService,
} from './services';
import {
  AuthService,
  ClientService,
  CommerceOSService,
  ConnectService,
  ConnectSettingsService,
  IntegrationService,
  UsersService,
} from './services/micros';

@Module({
  controllers: [
    // Consumers
    OrganizationConsumer,
    // Controllers
    PSPController,
  ],
  imports: [
    HttpModule,
    IntercomModule,
    MongooseModule.forFeature(
      [
        {
          name: OrganizationBusinessSchemaName,
          schema: OrganizationBusinessSchema,
        },
        {
          name: OrganizationSchemaName,
          schema: OrganizationSchema,
        },
      ],
    ),
  ],
  providers: [
    OrganizationService,
    PSPService,
    // Micro services
    AuthService,
    ClientService,
    CommerceOSService,
    ConnectService,
    ConnectSettingsService,
    UsersService,
    IntegrationService,
  ],
})
export class PSPModule { }

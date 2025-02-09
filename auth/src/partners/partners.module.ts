import { EventDispatcherModule } from '@pe/nest-kit';
import { MongooseModule } from '@nestjs/mongoose';
import { Module, forwardRef } from '@nestjs/common';
import { RabbitController, UserController } from './controllers';
import { BusinessService, ElasticIndexesUpdaterListener, PartnerTagsElastic, UserService } from './services';
import { UserModule, UserSchema, UserSchemaName } from '../users';
import { PartnerBusinessSchema, PartnerBusinessSchemaName } from './schemas';
import { PartnerTagsEsExportCommand, PartnerTagsEsSetupCommand } from './commands';

@Module({
  controllers: [ RabbitController, UserController ],
  exports: [],
  imports: [
    EventDispatcherModule,
    forwardRef(() => UserModule),
    MongooseModule.forFeature([
      {
        name: UserSchemaName,
        schema: UserSchema,
      },
      {
        name: PartnerBusinessSchemaName,
        schema: PartnerBusinessSchema,
      },
    ]),
  ],
  providers: [
    PartnerTagsEsExportCommand,
    PartnerTagsEsSetupCommand,
    ElasticIndexesUpdaterListener,
    PartnerTagsElastic,
    BusinessService,
    UserService,
  ],
})
export class PartnersModule { }

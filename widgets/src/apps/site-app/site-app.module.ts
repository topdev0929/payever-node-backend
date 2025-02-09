import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SiteSchema, SiteSchemaName } from './schemas';
import { SiteService } from './services';
import { SiteMessagesConsumer } from './consumers';

@Module({
  controllers: [
    SiteMessagesConsumer,
  ],
  exports: [
    SiteService,
  ],
  imports: [
    HttpModule,
    MongooseModule.forFeature(
      [
        { name: SiteSchemaName, schema: SiteSchema },
      ],
    ),
  ],
  providers: [
    SiteService,
  ],
})
export class SiteAppModule { }

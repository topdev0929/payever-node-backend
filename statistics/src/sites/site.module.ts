import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SiteMessagesConsumer } from './consumers';
import { SiteSchema, SiteSchemaName } from './schemas';
import { SiteService } from './services/site.service';

@Module({
  controllers: [
    SiteMessagesConsumer,
  ],
  exports: [SiteService],
  imports: [
    HttpModule,
    MongooseModule.forFeature(
      [{ name: SiteSchemaName, schema: SiteSchema }],
    ),
  ],
  providers: [
    SiteService,
  ],
})
export class SiteModule { }

import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopSchema, ShopSchemaName } from './schemas';
import { ShopService } from './services';
import { ShopMessagesConsumer } from './consumers';

@Module({
  controllers: [
    ShopMessagesConsumer,
  ],
  exports: [
    ShopService,
  ],
  imports: [
    HttpModule,
    MongooseModule.forFeature(
      [
        { name: ShopSchemaName, schema: ShopSchema },
      ],
    ),
  ],
  providers: [
    ShopService,
  ],
})
export class ShopAppModule { }

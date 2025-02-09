import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopMessagesConsumer } from './consumers';
import { ShopSchema, ShopSchemaName } from './schemas';
import { ShopService } from './services/shop.service';

@Module({
  controllers: [
    ShopMessagesConsumer,
  ],
  exports: [ShopService],
  imports: [
    HttpModule,
    MongooseModule.forFeature(
      [{ name: ShopSchemaName, schema: ShopSchema }],
    ),
  ],
  providers: [
    ShopService,
  ],
})
export class ShopsModule { }

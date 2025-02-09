import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CouponSchema, CouponSchemaName } from './schemas';
import { CouponService } from './services';
import { CouponMessagesConsumer } from './consumers';

@Module({
  controllers: [
    CouponMessagesConsumer,
  ],
  exports: [
    CouponService,
  ],
  imports: [
    HttpModule,
    MongooseModule.forFeature(
      [
        { name: CouponSchemaName, schema: CouponSchema },
      ],
    ),
  ],
  providers: [
    CouponService,
  ],
})
export class CouponAppModule { }

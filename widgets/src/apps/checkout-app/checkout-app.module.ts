import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CheckoutSchema, CheckoutSchemaName } from './schemas';
import { CheckoutService } from './services';
import { CheckoutMessagesConsumer } from './consumers';

@Module({
  controllers: [
    CheckoutMessagesConsumer,
  ],
  exports: [
    CheckoutService,
  ],
  imports: [
    HttpModule,
    MongooseModule.forFeature(
      [
        { name: CheckoutSchemaName, schema: CheckoutSchema },
      ],
    ),
  ],
  providers: [
    CheckoutService,
  ],
})
export class CheckoutAppModule { }

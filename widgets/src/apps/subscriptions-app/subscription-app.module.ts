import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionMessagesConsumer } from './consumers';
import { SubscriptionSchemaName, SubscriptionSchema } from './schemas';
import { SubscriptionService } from './services';

@Module({
  controllers: [
    SubscriptionMessagesConsumer,
  ],
  exports: [
    SubscriptionService,
  ],
  imports: [
    MongooseModule.forFeature([
      { name: SubscriptionSchemaName, schema: SubscriptionSchema },
    ]),
  ],
  providers: [
    SubscriptionService,
  ],
})
export class SubscriptionAppModule { }

import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessModule as KitBusinessModule } from '@pe/business-kit';
import { BusinessSchema, BusinessSchemaName, BusinessDetailSchemaName, BusinessDetailSchema } from '../mongoose-schema';
import { CheckoutBusinessService } from './services/checkout-business.service';
import { MessageBusChannelsEnum } from '../environments';

@Module({
  controllers: [
  ],
  exports: [
    CheckoutBusinessService,
  ],
  imports: [
    HttpModule,
    KitBusinessModule.forRoot({
      customBusinessDetailSchema: BusinessDetailSchema,
      customSchema: BusinessSchema,
      handleBusinessDetails: true,
      rabbitChannel: MessageBusChannelsEnum.checkout,
      useRPCCreatedMessage: true,
    }),
    MongooseModule.forFeature([
      {
        name: BusinessSchemaName,
        schema: BusinessSchema,
      },
      {
        name: BusinessDetailSchemaName,
        schema: BusinessDetailSchema,
      },
    ]),
  ],
  providers: [
    CheckoutBusinessService,
  ],
})
export class BusinessModule { }

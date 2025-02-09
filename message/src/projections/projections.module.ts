import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BusinessModule } from '@pe/business-kit';
import {
  RedisModule,
  IntercomModule,
  JwtAuthModule,
} from '@pe/nest-kit';
import {
  IntegrationSchemaName,
  IntegrationSchema,
  SubscriptionSchemaName,
  SubscriptionSchema,
  UserSchema,
  UserSchemaName,
  BusinessLocalSchema,
} from './schema';
import { BusinessConsumer, MessageAppConsumer, UsersConsumer, AuthUserConsumer } from './consumers';
import { IntegrationService, SubscriptionService, UsersService } from './services';
import { environment } from '../environments';

import { RabbitChannelsEnum } from '../message/enums';
@Module({
  controllers: [
    AuthUserConsumer,
    BusinessConsumer,
    MessageAppConsumer,
    UsersConsumer,
  ],
  exports: [
    SubscriptionService,
    UsersService,
  ],
  imports: [
    BusinessModule.forRoot({
      customSchema: BusinessLocalSchema as any,
      rabbitChannel: RabbitChannelsEnum.Message,
    }),
    IntercomModule,
    JwtAuthModule.forRoot(environment.jwtOptions),
    RedisModule.forRoot(environment.redis),
    MongooseModule.forFeature([{
      name: IntegrationSchemaName,
      schema: IntegrationSchema,
    }, {
      name: UserSchemaName,
      schema: UserSchema,
    }, {
      name: SubscriptionSchemaName,
      schema: SubscriptionSchema,
    }]),
  ],
  providers: [
    // Services
    IntegrationService,
    SubscriptionService,
    UsersService,
  ],
})
export class ProjectionsModule { }

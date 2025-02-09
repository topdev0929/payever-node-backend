import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FraudListSchemaName, FraudListSchema, FraudRuleSchemaName, FraudRuleSchema } from './schemas';
import { FraudListsController, FraudRulesController } from './controllers';
import { FraudListsService, FraudRulesService } from './services';
import { BusinessModule } from '@pe/business-kit';
import { MessageBusChannelsEnum } from './enums';

@Module({
  controllers: [
    FraudListsController,
    FraudRulesController,
  ],
  exports: [],
  imports: [
    HttpModule,
    MongooseModule.forFeature( [
      { name: FraudListSchemaName, schema: FraudListSchema },
      { name: FraudRuleSchemaName, schema: FraudRuleSchema },
    ]),
    BusinessModule.forRoot( {
      rabbitChannel: MessageBusChannelsEnum.fraud,
    }),
  ],
  providers: [
    FraudListsService,
    FraudRulesService,
  ],
})

export class FraudModule { }

import { RulesSdkOptionsInterface, RuleActionEnum, ConditionsService, RulesConditionDataTypeEnum } from '@pe/rules-sdk';

import { MessageBusChannelsEnum, RabbitExchangesEnum } from '../../environments/rabbitmq';
import { environment } from '../../environments';

export const RulesOptions: RulesSdkOptionsInterface = {
  actions: [
    RuleActionEnum.copy,
    RuleActionEnum.move,
  ],
  fields: [
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'createdBy',
      label: 'filters.createdBy',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'name',
      label: 'filters.name',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getNumberConditions(),
      fieldName: 'updatedAt',
      label: 'filters.updatedAt',
      type: RulesConditionDataTypeEnum.Date,
    },
  ],
  jwtSecret: environment.jwtOptions.secret,
  microservice: 'statistics',
  rabbitConfig: {
    channel: MessageBusChannelsEnum.statisticsFolders,
    exchange: RabbitExchangesEnum.statisticsFolders,
  },
  redisUrl: environment.redis.url,
  rulesWsMicro: environment.webSocket.wsMicro,
  useBusiness: true,
};

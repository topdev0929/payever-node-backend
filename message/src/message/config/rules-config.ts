import { ConditionsService, RulesSdkOptionsInterface, RuleActionEnum, RulesConditionDataTypeEnum } from '@pe/rules-sdk';
import { environment } from '../../environments';
import { RabbitExchangesEnum, RabbitChannelsEnum } from '../enums';

export const RulesOptions: RulesSdkOptionsInterface = {
  actions: [
    RuleActionEnum.copy,
    RuleActionEnum.move,
  ],
  fields: [
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'contact',
      label: 'filters.contact',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'integrationName',
      label: 'filters.integrationName',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'subType',
      label: 'filters.subType',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'type',
      label: 'filters.type',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'title',
      label: 'filters.title',
      type: RulesConditionDataTypeEnum.String,
    },
  ],
  jwtSecret: environment.jwtOptions.secret,
  microservice: 'message',
  rabbitConfig: {
    channel: RabbitChannelsEnum.MessageFolders,
    exchange: RabbitExchangesEnum.messageFolders,
  },
  redisUrl: environment.redis.url,
  rulesWsMicro: environment.wsMicro,
  strictAny: false,
  useBusiness: true,
  useUser: true,
};

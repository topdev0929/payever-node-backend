import { ConditionsService, RuleActionEnum, RulesConditionDataTypeEnum, RulesSdkOptionsInterface } from '@pe/rules-sdk';
import { environment } from '../../environments';
import { RabbitChannelsEnum, RabbitExchangesEnum } from '../enums';

export const RulesOptions: RulesSdkOptionsInterface = {
  actions: [
    RuleActionEnum.copy,
    RuleActionEnum.move,
  ],
  fields: [
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: '_id',
      label: 'filters._id',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'channelSet',
      label: 'filters.channelSet',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'country',
      label: 'filters.country',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'currency',
      label: 'filters.currency',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getNumberConditions(),
      fieldName: 'imports',
      label: 'filters.imports',
      type: RulesConditionDataTypeEnum.Number,
    },
    {
      conditions: ConditionsService.getNumberConditions(),
      fieldName: 'price',
      label: 'filters.price',
      type: RulesConditionDataTypeEnum.Number,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'title',
      label: 'filters.title',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'type',
      label: 'filters.type',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getNumberConditions(),
      fieldName: 'updatedAt',
      label: 'filters.updatedAt',
      type: RulesConditionDataTypeEnum.Number,
    },
  ],
  jwtSecret: environment.jwtOptions.secret,
  microservice: 'marketplace',
  rabbitConfig: {
    channel: RabbitChannelsEnum.MarketplaceFolders,
    exchange: RabbitExchangesEnum.marketplaceFolders,
  },
  redisConfig: environment.redis,
  rulesWsMicro: environment.webSocket.wsMicro,
  useBusiness: true,
};

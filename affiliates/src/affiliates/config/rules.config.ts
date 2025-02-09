import { ConditionsService, RulesSdkOptionsInterface, RuleActionEnum, RulesConditionDataTypeEnum } from '@pe/rules-sdk';
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
      conditions: ConditionsService.getNumberConditions(),
      fieldName: 'assets',
      label: 'filters.assets',
      type: RulesConditionDataTypeEnum.Number,
    },
    {
      conditions: ConditionsService.getNumberConditions(),
      fieldName: 'clicks',
      label: 'filters.clicks',
      type: RulesConditionDataTypeEnum.Number,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'commissionType',
      label: 'filters.commissionType',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getNumberConditions(),
      fieldName: 'cookie',
      label: 'filters.cookie',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'currency',
      label: 'filters.currency',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'name',
      label: 'filters.name',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'programApi',
      label: 'filters.programApi',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getNumberConditions(),
      fieldName: 'startedAt',
      label: 'filters.startedAt',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'status',
      label: 'filters.status',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'url',
      label: 'filters.url',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getNumberConditions(),
      fieldName: 'updatedAt',
      label: 'filters.updatedAt',
      type: RulesConditionDataTypeEnum.String,
    },
  ],
  jwtSecret: environment.jwtOptions.secret,
  microservice: 'affiliate',
  rabbitConfig: {
    channel: RabbitChannelsEnum.AffiliatesFolders,
    exchange: RabbitExchangesEnum.affiliatesFolders,
  },
  redisUrl: environment.redis.url,
  rulesWsMicro: environment.webSocket.wsMicro,
  useBusiness: true,
};

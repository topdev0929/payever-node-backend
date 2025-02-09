import { RulesSdkOptionsInterface, RuleActionEnum, ConditionsService, RulesConditionDataTypeEnum } from '@pe/rules-sdk';
import { environment } from '../../environments';
import { MessageBusChannelsEnum, RabbitExchangesEnum } from '../../shared';

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
      fieldName: 'album',
      label: 'filters.album',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'barcode',
      label: 'filters.barcode',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'company',
      label: 'filters.company',
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
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'description',
      label: 'filters.description',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'language',
      label: 'filters.language',
      type: RulesConditionDataTypeEnum.String,
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
      fieldName: 'vatRate',
      label: 'filters.vatRate',
      type: RulesConditionDataTypeEnum.Number,
    },
    {
      conditions: ConditionsService.getNumberConditions(),
      fieldName: 'updatedAt',
      label: 'filters.updatedAt',
      type: RulesConditionDataTypeEnum.String,
    },
  ],
  jwtSecret: environment.jwtOptions.secret,
  microservice: 'products',
  rabbitConfig: {
    channel: MessageBusChannelsEnum.productsFolders,
    exchange: RabbitExchangesEnum.productsFolders,
  },
  redisConfig: environment.redis,
  rulesWsMicro: environment.webSocket.wsMicro,
  useBusiness: true,
};

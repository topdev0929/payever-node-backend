import { ConditionsService, RulesSdkOptionsInterface, RuleActionEnum, RulesConditionDataTypeEnum } from '@pe/rules-sdk';
import { environment } from '../../environments';
import { RabbitChannelsEnum, RabbitExchangesEnum } from '../../environments/rabbitmq';

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
      fieldName: 'createdBy',
      label: 'filters.createdBy',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'dimensionUnit',
      label: 'filters.dimensionUnit',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getNumberConditions(),
      fieldName: 'height',
      label: 'filters.height',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'integration',
      label: 'filters.integration',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'kind',
      label: 'filters.kind',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getNumberConditions(),
      fieldName: 'length',
      label: 'filters.length',
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
      fieldName: 'type',
      label: 'filters.type',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getNumberConditions(),
      fieldName: 'weight',
      label: 'filters.weight',
      type: RulesConditionDataTypeEnum.Number,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'weightUnit',
      label: 'filters.weightUnit',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getNumberConditions(),
      fieldName: 'width',
      label: 'filters.width',
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
  microservice: 'shipping',
  rabbitConfig: {
    channel: RabbitChannelsEnum.ShippingFolders,
    exchange: RabbitExchangesEnum.shippingFolders,
  },
  redisConfig: environment.redis,
  rulesWsMicro: environment.webSocket.wsMicro,
  useBusiness: true,
};

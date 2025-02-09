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
      fieldName: 'album',
      label: 'filters.album',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'example',
      label: 'filters.example',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'mediaType',
      label: 'filters.mediaType',
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
  rabbitConfig: {
    channel: RabbitChannelsEnum.StudioFolders,
    exchange: RabbitExchangesEnum.studioFolders,
  },
  redisConfig: environment.redis,
  rulesWsMicro: `ws://localhost:${environment.webSocket.port}`,
  useBusiness: true,
  microservice: 'studio',
};

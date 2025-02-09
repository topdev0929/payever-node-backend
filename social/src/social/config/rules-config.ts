import { ConditionsService, RuleActionEnum, RulesConditionDataTypeEnum, RulesSdkOptionsInterface } from '@pe/rules-sdk';
import { environment } from '../../environments';
import { RabbitChannelsEnum, RabbitExchangesEnum } from '../../common';

export const RulesOptions: RulesSdkOptionsInterface = {
  actions: [
    RuleActionEnum.copy,
    RuleActionEnum.move,
  ],
  fields: [
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'channelSet',
      label: 'filters.channelSet',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'content',
      label: 'filters.content',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'media',
      label: 'filters.media',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getNumberConditions(),
      fieldName: 'postedAt',
      label: 'filters.postedAt',
      type: RulesConditionDataTypeEnum.Number,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'sentStatus',
      label: 'filters.sentStatus',
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
      fieldName: 'title',
      label: 'filters.title',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'toBePostedAt',
      label: 'filters.toBePostedAt',
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
  microservice: environment.microservice,
  rabbitConfig: {
    channel: RabbitChannelsEnum.SocialFolders,
    exchange: RabbitExchangesEnum.socialFolders,
  },
  redisConfig: environment.redis,
  rulesWsMicro: environment.webSocket.wsMicro,
  useBusiness: true,
};

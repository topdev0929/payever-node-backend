import {
  ConditionsService,
  RuleActionEnum,
  RulesConditionDataTypeEnum,
  RulesConditionEnum,
  RulesSdkOptionsInterface,
} from '@pe/rules-sdk';

import { RabbitChannelsEnum, RabbitExchangesEnum } from '../enums';

export const RulesOptions: RulesSdkOptionsInterface = {
  actions: [
    RuleActionEnum.copy,
    RuleActionEnum.move,
  ],
  fields: [
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'location',
      label: 'filters.location',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'date',
      label: 'filters.date',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'time',
      label: 'filters.time',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: [RulesConditionEnum.equals],
      externalAppCode: 'contacts',
      fieldName: 'contacts',
      label: 'filters.contact',
      type: RulesConditionDataTypeEnum.String,
    },
  ],
  microservice: 'appointments',
  rabbitConfig: {
    channel: RabbitChannelsEnum.AppointmentsFolders,
    exchange: RabbitExchangesEnum.appointmentsFolders,
  },
  useBusiness: true,
};

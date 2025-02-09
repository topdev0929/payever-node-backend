import { ConditionsService, RulesSdkOptionsInterface, RuleActionEnum, RulesConditionDataTypeEnum } from '@pe/rules-sdk';
import { environment } from '../environments';
import { RabbitChannels, RabbitExchangesEnum } from '../enums';
import {
  TranslationPrefixEnum,
  ValuesService,
  PaymentOptionsEnum,
} from '@pe/common-sdk';
import { PaymentStatusesEnum, PaymentSpecificStatusEnum } from '../transactions/enum';

export const RulesOptions: RulesSdkOptionsInterface = {
  actions: [
    RuleActionEnum.copy,
    RuleActionEnum.move,
  ],
  fields: [
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'original_id',
      label: 'filters.original_id',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'reference',
      label: 'filters.reference',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getNumberConditions(),
      fieldName: 'created_at',
      label: 'filters.created_at',
      type: RulesConditionDataTypeEnum.Number,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'type',
      label: 'filters.payment_option',
      options: ValuesService.getChoices(TranslationPrefixEnum.integrationsPayments, PaymentOptionsEnum, 'title'),
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'status',
      label: 'filters.status',
      options: ValuesService.getChoices(TranslationPrefixEnum.transactionStatuses, PaymentStatusesEnum),
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'specific_status',
      label: 'filters.specific_status',
      options: ValuesService.getChoices(TranslationPrefixEnum.transactionSpecificStatus, PaymentSpecificStatusEnum),
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'channel',
      label: 'filters.channel',
      options: ValuesService.getChannelValuesChoices(),
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getNumberConditions(),
      fieldName: 'amount_left',
      label: 'filters.amount',
      type: RulesConditionDataTypeEnum.Number,
    },
    {
      conditions: ConditionsService.getNumberConditions(),
      fieldName: 'total_left',
      label: 'filters.total',
      type: RulesConditionDataTypeEnum.Number,
    },
    {
      conditions: ConditionsService.getNumberConditions(),
      fieldName: 'currency',
      label: 'filters.currency',
      type: RulesConditionDataTypeEnum.Number,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'customer_name',
      label: 'filters.customer_name',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'customer_email',
      label: 'filters.customer_email',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'merchant_name',
      label: 'filters.merchant_name',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'merchant_email',
      label: 'filters.merchant_email',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'seller_name',
      label: 'filters.seller_name',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'seller_email',
      label: 'filters.seller_email',
      type: RulesConditionDataTypeEnum.String,
    },
    {
      conditions: ConditionsService.getStringConditions(),
      fieldName: 'seller_id',
      label: 'filters.seller_id',
      type: RulesConditionDataTypeEnum.String,
    },
  ],
  jwtSecret: environment.jwtOptions.secret,
  microservice: 'transactions',
  rabbitConfig: {
    channel: RabbitChannels.TransactionsFolders,
    exchange: RabbitExchangesEnum.transactionsFolders,
  },
  redisConfig: environment.redis,
  rulesWsMicro: environment.webSocket.wsMicro,
  useBusiness: true,
};

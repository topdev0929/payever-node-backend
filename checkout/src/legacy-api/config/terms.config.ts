import { TermsInterface } from '../interfaces';
import { PaymentMethodEnum, TermsFieldsTypeEnum } from '../enum';

export const TermsConfig: Map<string, TermsInterface[]> = new Map<string, TermsInterface[]>([
  [
    PaymentMethodEnum.METHOD_SANTANDER_DE_POS_INVOICE,
    [
      {
        channel: 'pos',
        channel_type: 'self_checkout',
        default: true,
        form: [
          {
            field_name: 'conditions_accepted',
            field_text: 'santander-de-invoice.inquiry.form.conditions_accepted.label',
            required: true,
            type: TermsFieldsTypeEnum.checkbox,
          },
          {
            field_name: 'advertising_accepted',
            field_text: 'santander-de-invoice.inquiry.form.advertising_accepted.label',
            required: false,
            type: TermsFieldsTypeEnum.checkbox,
          },
        ],
        legal_text: 'santander-de-invoice.inquiry.form.advertising_accepted.text',
      },
      {
        channel: 'pos',
        channel_type: 'terminal',
        default: false,
        form: [
          {
            field_name: 'conditions_accepted',
            field_text: 'santander-de-invoice.inquiry.form.conditions_accepted.label',
            required: true,
            type: TermsFieldsTypeEnum.checkbox,
          },
          {
            field_name: 'advertising_accepted',
            field_text: 'santander-de-invoice.inquiry.form.advertising_accepted.label',
            required: false,
            type: TermsFieldsTypeEnum.checkbox,
          },
        ],
        legal_text: 'santander-de-invoice.inquiry.form.advertising_accepted.text',
      },
    ],
  ],
  [
    PaymentMethodEnum.METHOD_SANTANDER_DE_POS_FACTORING,
    [
      {
        channel: 'pos',
        channel_type: 'self_checkout',
        default: true,
        form: [
          {
            field_name: 'conditions_accepted',
            field_text: 'inquiry.form.conditions_accepted.label',
            required: true,
            type: TermsFieldsTypeEnum.checkbox,
          },
          {
            field_name: 'advertising_accepted',
            field_text: 'inquiry.form.advertising_accepted.label',
            required: false,
            type: TermsFieldsTypeEnum.checkbox,
          },
        ],
        legal_text: 'inquiry.form.advertising_accepted.text',
      },
      {
        channel: 'pos',
        channel_type: 'terminal',
        default: false,
        form: [
          {
            field_name: 'conditions_accepted',
            field_text: 'inquiry.form.conditions_accepted.label',
            required: true,
            type: TermsFieldsTypeEnum.checkbox,
          },
          {
            field_name: 'advertising_accepted',
            field_text: 'inquiry.form.advertising_accepted.label',
            required: false,
            type: TermsFieldsTypeEnum.checkbox,
          },
        ],
        legal_text: 'inquiry.form.advertising_accepted.text',
      },
    ],
  ],
  [
    PaymentMethodEnum.METHOD_SANTANDER_DE_INVOICE,
    [
      {
        default: true,
        form: [
          {
            field_name: 'conditions_accepted',
            field_text: 'santander-de-invoice.inquiry.form.conditions_accepted.label',
            required: true,
            type: TermsFieldsTypeEnum.checkbox,
          },
          {
            field_name: 'advertising_accepted',
            field_text: 'santander-de-invoice.inquiry.form.advertising_accepted.label',
            required: false,
            type: TermsFieldsTypeEnum.checkbox,
          },
        ],
        legal_text: 'santander-de-invoice.inquiry.form.advertising_accepted.text',
      },
    ],
  ],
  [
    PaymentMethodEnum.METHOD_SANTANDER_DE_INSTALLMENT,
    [
      {
        default: true,
        form: [
          {
            field_name: 'credit_accepts_requests_to_credit_agencies',
            field_text: 'santander-de.inquiry.form.credit_accepts_requests_to_credit_agencies.label',
            required: true,
            type: TermsFieldsTypeEnum.checkbox,
          },
        ],
        legal_text: 'santander-de.inquiry.form.credit_accepts_requests_to_credit_agencies.text',
      },
    ],
  ],
  [
    PaymentMethodEnum.METHOD_SANTANDER_DE_FACTORING,
    [
      {
        default: true,
        form: [
          {
            field_name: 'conditions_accepted',
            field_text: 'inquiry.form.conditions_accepted.label',
            required: true,
            type: TermsFieldsTypeEnum.checkbox,
          },
          {
            field_name: 'advertising_accepted',
            field_text: 'inquiry.form.advertising_accepted.label',
            required: false,
            type: TermsFieldsTypeEnum.checkbox,
          },
        ],
        legal_text: 'inquiry.form.advertising_accepted.text',
      },
    ],
  ],
  [
    PaymentMethodEnum.METHOD_SANTANDER_DE_POS_INSTALLMENT,
    [
      {
        channel: 'pos',
        channel_type: 'self_checkout',
        default: true,
        form: [
          {
            field_name: 'customer_conditions_accepted',
            field_text: 'pos_installment_de_customer_conditions_accepted_key',
            required: false,
            type: TermsFieldsTypeEnum.checkbox,
          },
          {
            field_name: 'web_id_conditions_accepted',
            field_text: 'pos_installment_de_web_id_conditions_accepted_key',
            required: false,
            type: TermsFieldsTypeEnum.checkbox,
          },
        ],
        legal_text: 'pos_installment_de_legal_text_key_self_checkout',
      },
      {
        channel: 'pos',
        channel_type: 'terminal',
        default: false,
        form: [
          {
            field_name: 'customer_conditions_accepted',
            field_text: 'pos_installment_de_customer_conditions_accepted_key',
            required: true,
            type: TermsFieldsTypeEnum.checkbox,
          },
          {
            field_name: 'web_id_conditions_accepted',
            field_text: 'pos_installment_de_web_id_conditions_accepted_key',
            required: true,
            type: TermsFieldsTypeEnum.checkbox,
          },
        ],
        legal_text: 'pos_installment_de_legal_text_key_terminal',
      },
    ],
  ],
  [
    PaymentMethodEnum.METHOD_ZINIA_BNPL,
    [
      {
        default: true,
        hasRemoteTerms: true,
      },
    ],
  ],
  [
    PaymentMethodEnum.METHOD_ZINIA_INSTALLMENT,
    [
      {
        default: true,
        hasRemoteTerms: true,
      },
    ],
  ],
  [
    PaymentMethodEnum.METHOD_ZINIA_POS_INSTALLMENT,
    [
      {
        default: true,
        hasRemoteTerms: true,
      },
    ],
  ],
  [
    PaymentMethodEnum.METHOD_ZINIA_POS,
    [
      {
        default: true,
        hasRemoteTerms: true,
      },
    ],
  ],
  [
    PaymentMethodEnum.METHOD_ZINIA_SLICE_THREE,
    [
      {
        default: true,
        hasRemoteTerms: true,
      },
    ],
  ],
  [
    PaymentMethodEnum.METHOD_ZINIA_POS_SLICE_THREE,
    [
      {
        default: true,
        hasRemoteTerms: true,
      },
    ],
  ],
  [
    PaymentMethodEnum.METHOD_ZINIA_BNPL_DE,
    [
      {
        default: true,
        hasRemoteTerms: true,
      },
    ],
  ],
  [
    PaymentMethodEnum.METHOD_ZINIA_INSTALLMENT_DE,
    [
      {
        default: true,
        hasRemoteTerms: true,
      },
    ],
  ],
  [
    PaymentMethodEnum.METHOD_ZINIA_POS_INSTALLMENT_DE,
    [
      {
        default: true,
        hasRemoteTerms: true,
      },
    ],
  ],
  [
    PaymentMethodEnum.METHOD_ZINIA_POS_DE,
    [
      {
        default: true,
        hasRemoteTerms: true,
      },
    ],
  ],
  [
    PaymentMethodEnum.METHOD_ZINIA_SLICE_THREE_DE,
    [
      {
        default: true,
        hasRemoteTerms: true,
      },
    ],
  ],
  [
    PaymentMethodEnum.METHOD_ZINIA_POS_SLICE_THREE_DE,
    [
      {
        default: true,
        hasRemoteTerms: true,
      },
    ],
  ],
]);

// tslint:disable:object-literal-sort-keys
type PaymentOptionTwigTranslations = {
  cash: string;
  invoice: string;
  payex_creditcard: string;
  payex_faktura: string;
  paymill_creditcard: string;
  paymill_directdebit: string;
  paypal: string;
  santander_ccp_installment: string;
  santander_factoring_de: string;
  santander_installment: string;
  santander_installment_dk: string;
  santander_installment_no: string;
  santander_installment_se: string;
  santander_invoice_de: string;
  santander_invoice_no: string;
  santander_pos_factoring_de: string;
  santander_pos_installment: string;
  santander_pos_installment_dk: string;
  santander_pos_installment_no: string;
  santander_pos_installment_se: string;
  santander_pos_invoice_de: string;
  santander_pos_invoice_no: string;
  sofort: string;
  stripe: string;
  stripe_directdebit: string;
  santander_installment_nl: string;
  santander_installment_at: string;
  swedbank_invoice: string;
  swedbank_creditcard: string;
  instant_payment: string;
  apple_pay: string;
  google_wallet: string;
  openbank: string;
  santander_installment_uk: string;
};

export class PaymentOptionTwigFilter {
  public static filter(paymentOption: any): string {
    const translations: PaymentOptionTwigTranslations = {
      cash: 'Wire Transfer',
      invoice: 'Invoice',
      payex_creditcard: 'PayEx Credit Card',
      payex_faktura: 'PayEx Invoice',
      paymill_creditcard: 'Paymill Credit Card',
      paymill_directdebit: 'Direct Debit',
      paypal: 'PayPal',
      santander_ccp_installment: 'Santander DE Comfort card plus',
      santander_factoring_de: 'Santander Factoring',
      santander_installment: 'Santander Installments',
      santander_installment_dk: 'Santander Installments DK',
      santander_installment_no: 'Santander Installments NO',
      santander_installment_se: 'Santander Installments SE',
      santander_invoice_de: 'Santander DE Invoice',
      santander_invoice_no: 'Santander Invoice NO',
      santander_pos_factoring_de: 'Santander POS Factoring',
      santander_pos_installment: 'POS Santander Installments',
      santander_pos_installment_dk: 'POS Santander Installments DK',
      santander_pos_installment_no: 'POS Santander Installments NO',
      santander_pos_installment_se: 'POS Santander Installments SE',
      santander_pos_invoice_de: 'Santander Invoice DE POS',
      santander_pos_invoice_no: 'Santander Invoice NO',
      sofort: 'SOFORT Banking',
      stripe: 'Credit Card',
      stripe_directdebit: 'Stripe DirectDebit',
      santander_installment_nl: 'Santander Installments NL',
      santander_installment_at: 'Santander Installments AT',
      swedbank_invoice: 'Swedbank',
      swedbank_creditcard: 'Swedbank Credit Card',
      instant_payment: 'Instant Payment',
      apple_pay: 'Apple Pay',
      google_wallet: 'Google Wallet',
      openbank: 'Openbank',
      santander_installment_uk: 'Santander Installments UK',
    };

    if (paymentOption && paymentOption.payment_method && translations[paymentOption.payment_method]) {
      return translations[paymentOption.payment_method];
    }

    if (paymentOption && translations[paymentOption]) {
      return translations[paymentOption];
    }

    return paymentOption;
  }
}

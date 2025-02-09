/* eslint-disable */
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

export class PaymentOptionDETwigFilter {
  public static filter(paymentOption: any): string {
    const translations: PaymentOptionTwigTranslations = {
      cash: 'Vorkasse',
      invoice: 'Rechnungskauf',
      payex_creditcard: 'PayEx Credit Card',
      payex_faktura: 'PayEx Invoice',
      paymill_creditcard: 'Paymill Credit Card',
      paymill_directdebit: 'Direct Debit',
      paypal: 'PayPal',
      santander_ccp_installment: 'Santander DE Komfortkarte plus',
      santander_factoring_de: 'Santander Ratenkauf',
      santander_installment: 'Santander Ratenkredit',
      santander_installment_dk: 'Santander Ratenkredit DK',
      santander_installment_no: 'Santander Ratenkredit NO',
      santander_installment_se: 'Santander Ratenkredit SE',
      santander_invoice_de: 'Santander DE Rechnungskauf',
      santander_invoice_no: 'Santander Rechnungskauf NO',
      santander_pos_factoring_de: 'Santander POS Ratenkauf',
      santander_pos_installment: 'POS Santander Ratenkredit',
      santander_pos_installment_dk: 'POS Santander Ratenkredit DK',
      santander_pos_installment_no: 'POS Santander Ratenkredit NO',
      santander_pos_installment_se: 'POS Santander Ratenkredit SE',
      santander_pos_invoice_de: 'Santander Rechnungskauf DE POS',
      santander_pos_invoice_no: 'Santander Rechnungskauf NO',
      sofort: 'SOFORT Banking',
      stripe: 'Kreditkarte',
      stripe_directdebit: 'Stripe Lastschrift',
      santander_installment_nl: 'Santander Ratenkredit NL',
      santander_installment_at: 'Santander Ratenkredit AT',
      swedbank_invoice: 'Swedbank',
      swedbank_creditcard: 'Swedbank Kreditkarte',
      instant_payment: 'Instant Payment',
      apple_pay: 'Apple Pay',
      google_wallet: 'Google Wallet',
      openbank: 'Openbank',
      santander_installment_uk: 'Santander Ratenkredit UK',
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

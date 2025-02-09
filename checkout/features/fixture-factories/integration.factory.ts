/* eslint-disable-no-identical-functions no-duplicate-string */
import { DefaultFactory, PartialFactory, partialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';
import { IntegrationInterface } from '../../src/integration/interfaces';
import { IntegrationId } from './integration-id';

const seq: SequenceGenerator = new SequenceGenerator(1);

type IntegrationType = IntegrationInterface & { _id: string };

const LocalFactory: DefaultFactory<IntegrationType> = (): IntegrationType => {
  seq.next();

  return {
    _id: uuid.v4(),
    category: `category${seq.current}`,
    displayOptions: {
      icon: `#icon-payment-option${seq.current}`,
      title: `integrations.payments.title${seq.current}`,
    },
    isVisible: true,
    name: `integration ${seq.current}`,
    settingsOptions: {
      source: 'source',
    },
  };
};

export class IntegrationFactory {
  public static create: PartialFactory<IntegrationType> = partialFactory<IntegrationType>(LocalFactory);

  public static createDefaultIntegrations(): IntegrationType[] {
    const integrations: IntegrationType[] = [];

    for (const integration of this.createAccountingsIntegrations()) {
      integrations.push(integration);
    }

    for (const integration of this.createApplicationsIntegrations()) {
      integrations.push(integration);
    }

    for (const integration of this.createChannelsIntegrations()) {
      integrations.push(integration);
    }

    for (const integration of this.createCommunicationsIntegrations()) {
      integrations.push(integration);
    }

    for (const integration of this.createPaymentsIntegrations()) {
      integrations.push(integration);
    }

    for (const integration of this.createShippingsIntegrations()) {
      integrations.push(integration);
    }

    for (const integration of this.createShopsystemsIntegrations()) {
      integrations.push(integration);
    }

    return integrations;
  }

  public static createAccountingsIntegrations(): IntegrationType[] {
    const integrations: IntegrationType[] = [];
    let integration: IntegrationType;

    integration = this.create({
      _id : IntegrationId.Debitoor,
      category: 'accountings',
      displayOptions: {
        icon: '#icon-debitoor-bw',
        title: 'Debitoor',
      },
      name: 'debitoor',
      settingsOptions: {
        source: 'source',
      },
    });
    integrations.push(integration);

    return integrations;
  }

  public static createApplicationsIntegrations(): IntegrationType[] {
    const integrations: IntegrationType[] = [];
    let integration: IntegrationType;

    integration = this.create({
      _id : IntegrationId.Pos,
      category: 'applications',
      displayOptions: {
        icon: '#icon-apps-pos',
        title: 'channelsList.pos',
      },
      name: 'pos',
      settingsOptions: {
        source: 'source',
      },
    });
    integrations.push(integration);

    integration = this.create({
      _id : IntegrationId.Marketing,
      category: 'applications',
      displayOptions: {
        icon: '#icon-apps-marketing',
        title: 'channelsList.marketing',
      },
      name: 'marketing',
      settingsOptions: {
        source: 'source',
      },
    });
    integrations.push(integration);

    integration = this.create({
      _id : IntegrationId.Shop,
      category: 'applications',
      displayOptions: {
        icon: '#icon-apps-store',
        title: 'channelsList.shop',
      },
      name: 'shop',
      settingsOptions: {
        source: 'source',
      },
    });
    integrations.push(integration);

    return integrations;
  }

  public static createChannelsIntegrations(): IntegrationType[] {
    const integrations: IntegrationType[] = [];
    let integration: IntegrationType;

    integration = this.create({
      _id : IntegrationId.Bubble,
      category: 'channels',
      displayOptions: {
        icon: '#icon-bubble-16',
        title: 'channelsList.bubble',
      },
      name: 'bubble',
      settingsOptions: {
        source: 'source',
      },
    });
    integrations.push(integration);

    integration = this.create({
      _id : IntegrationId.TextLink,
      category: 'channels',
      displayOptions: {
        icon: '#icon-link2-16',
        title: 'channelsList.textLink',
      },
      name: 'textLink',
      settingsOptions: {
        source: 'source',
      },
    });
    integrations.push(integration);

    integration = this.create({
      _id : IntegrationId.Calculator,
      category: 'channels',
      displayOptions: {
        icon: '#icon-b-layout-32',
        title: 'channelsList.calculator',
      },
      name: 'calculator',
      settingsOptions: {
        source: 'source',
      },
    });
    integrations.push(integration);

    integration = this.create({
      _id : IntegrationId.Button,
      category: 'channels',
      displayOptions: {
        icon: '#icon-ep-button-16',
        title: 'channelsList.button',
      },
      name: 'button',
      settingsOptions: {
        source: 'source',
      },
    });
    integrations.push(integration);

    integration = this.create({
      _id : IntegrationId.DirectLink,
      category: 'channels',
      displayOptions: {
        icon: '#icon-link2-16',
        title: 'channelsList.directLink',
      },
      name: 'direct_link',
      settingsOptions: {
        source: 'source',
      },
    });
    integrations.push(integration);

    return integrations;
  }

  public static createCommunicationsIntegrations(): IntegrationType[] {
    const integrations: IntegrationType[] = [];
    let integration: IntegrationType;

    integration = this.create({
      _id : IntegrationId.Twilio,
      category: 'communications',
      displayOptions: {
        icon: '#icon-communication-twillio',
        title: 'Twilio SMS',
      },
      name: 'twilio',
      settingsOptions: {
        source: 'source',
      },
    });
    integrations.push(integration);

    integration = this.create({
      _id : IntegrationId.Qr,
      category: 'communications',
      displayOptions : {
        icon : '#icon-communications-qr-white',
        title : 'integrations.communications.qr.title',
      },
      name: 'qr',
      settingsOptions: {
        source: 'source',
      },
    });
    integrations.push(integration);

    return integrations;
  }

  public static createPaymentsIntegrations(): IntegrationType[] {
    const integrations: IntegrationType[] = [];
    let integration: IntegrationType;

    integration = this.create({
      _id : IntegrationId.Paypal,
      category: 'payments',
      displayOptions: {
        icon: '#icon-payment-option-paypall',
        title: 'integrations.payments.paypal.title',
      },
      name: 'paypal',
      settingsOptions: {
        source: 'source',
      },
    });
    integrations.push(integration);

    integration = this.create({
      _id : IntegrationId.StripeDirectDebit,
      category: 'payments',
      displayOptions: {
        icon: '#icon-payment-option-stripe-direct-debit',
        title: 'integrations.payments.stripe_directdebit.title',
      },
      name: 'stripe_directdebit',
      settingsOptions: {
        source: 'source',
      },
    });
    integrations.push(integration);

    integration = this.create({
      _id : IntegrationId.SantanderPosFactoringDe,
      category: 'payments',
      displayOptions: {
        icon: '#icon-payment-option-santander',
        title: 'integrations.payments.santander_pos_factoring_de.title',
      },
      name: 'santander_pos_factoring_de',
    });
    integrations.push(integration);

    integration = this.create({
      _id : IntegrationId.SantanderFactoringDe,
      category: 'payments',
      displayOptions: {
        icon: '#icon-payment-option-santander',
        title: 'integrations.payments.santander_factoring_de.title',
      },
      name: 'santander_factoring_de',
      settingsOptions: {
        source: 'source',
      },
    });
    integrations.push(integration);

    integration = this.create({
      _id : IntegrationId.SantanderInstallment,
      category: 'payments',
      displayOptions: {
        icon: '#icon-payment-option-santander',
        title: 'integrations.payments.santander_installment.title',
      },
      name: 'santander_installment',
      settingsOptions: {
        source: 'source',
      },
    });
    integrations.push(integration);

    integration = this.create({
      _id : IntegrationId.SantanderCppInstallment,
      category: 'payments',
      displayOptions: {
        icon: '#icon-payment-option-santander',
        title: 'integrations.payments.santander_ccp_installment.title',
      },
      name: 'santander_ccp_installment',
      settingsOptions: {
        source: 'source',
      },
    });
    integrations.push(integration);

    integration = this.create({
      _id : IntegrationId.SantanderInvoiceDe,
      category: 'payments',
      displayOptions: {
        icon: '#icon-payment-option-santander',
        title: 'integrations.payments.santander_invoice_de.title',
      },
      name: 'santander_invoice_de',
      settingsOptions: {
        source: 'source',
      },
    });
    integrations.push(integration);

    integration = this.create({
      _id : IntegrationId.Cash,
      autoEnable: true,
      category: 'payments',
      displayOptions: {
        icon: '#icon-payment-option-wire-transfer',
        title: 'integrations.payments.cash.title',
      },
      name: 'cash',
      settingsOptions: {
        source: 'source',
      },
    });
    integrations.push(integration);

    integration = this.create({
      _id : IntegrationId.ApplePay,
      category: 'payments',
      displayOptions: {
        icon: '#icon-payment-option-apple-pay',
        title: 'integrations.payments.apple-pay.title',
      },
      name: 'apple_pay',
      settingsOptions: {
        source: 'source',
      },
    });
    integrations.push(integration);

    integration = this.create(
      {
        _id : IntegrationId.GooglePay,
        category: 'payments',
        displayOptions: {
          icon: '#icon-payment-option-google-pay',
          title: 'integrations.payments.google-pay.title',
        },
        name: 'google_pay',
        settingsOptions: {
          source: 'source',
        },
      });
    integrations.push(integration);

    integration = this.create(
      {
        _id : IntegrationId.SantanderInstallmentUk,
        category: 'payments',
        displayOptions: {
          icon: '#icon-payment-option-santander',
          title: 'integrations.payments.santander_installment_uk.title',
        },
        name: 'santander_installment_uk',
        settingsOptions: {
          source: 'source',
        },
      });
    integrations.push(integration);

    integration = this.create(
      {
        _id : IntegrationId.SantanderPosInstallmentUk,
        category: 'payments',
        displayOptions: {
          icon: '#icon-payment-option-santander',
          title: 'integrations.payments.santander_pos_installment_uk.title',
        },
        name: 'santander_pos_installment_uk',
        settingsOptions: {
          source: 'source',
        },
      });
    integrations.push(integration);

    integration = this.create(
      {
        _id : IntegrationId.Openbank,
        category: 'payments',
        displayOptions: {
        icon: '#icon-payment-option-openbank',
          title: 'integrations.payments.openbank.title',
      },
      name: 'openbank',
      settingsOptions: {
        source: 'source',
      },
    });
    integrations.push(integration);

    integration = this.create(
      {
        _id : IntegrationId.SantanderInstallmentFi,
        category: 'payments',
        displayOptions: {
          icon: '#icon-payment-option-santander',
          title: 'integrations.payments.santander_installment_fi.title',
        },
        name: 'santander_installment_fi',
        settingsOptions: {
          source: 'source',
        },
      });
    integrations.push(integration);

    integration = this.create(
      {
        _id : IntegrationId.SantanderPosInstallmentFi,
        category: 'payments',
        displayOptions: {
          icon: '#icon-payment-option-santander',
          title: 'integrations.payments.santander_pos_installment_fi.title',
        },
        name: 'santander_pos_installment_fi',
        settingsOptions: {
          source: 'source',
        },
      });
    integrations.push(integration);

    return integrations;
  }

  public static createShippingsIntegrations(): IntegrationType[] {
    const integrations: IntegrationType[] = [];
    let integration: IntegrationType;

    integration = this.create({
      _id : IntegrationId.Ups,
      category: 'shippings',
      displayOptions: {
        icon: '#icon-shipping-ups-white',
        title: 'integrations.shippings.ups.title',
      },
      name: 'ups',
      settingsOptions: {
        source: 'source',
      },
    });
    integrations.push(integration);

    integration = this.create({
      _id : IntegrationId.Dhl,
      category: 'shippings',
      displayOptions: {
        icon: '#icon-shipping-dhl-32',
        title: 'integrations.shippings.dhl.title',
      },
      name: 'dhl',
      settingsOptions: {
        source: 'source',
      },
    });
    integrations.push(integration);

    integration = this.create({
      _id : IntegrationId.Shipping,
      category: 'shippings',
      displayOptions: {
        icon: '#icon-apps-shipping',
        title: 'integrations.shippings.shipping.title',
      },
      name: 'shipping',
      settingsOptions: {
        source: 'source',
      },
    });
    integrations.push(integration);

    return integrations;
  }

  public static createShopsystemsIntegrations(): IntegrationType[] {
    const integrations: IntegrationType[] = [];
    let integration: IntegrationType;

    integration = this.create({
      _id : IntegrationId.Shopify,
      category: 'shopsystems',
      displayOptions: {
        icon: '#icon-shopify',
        title: 'Shopify',
      },
      name: 'shopify',
      settingsOptions: {
        source: 'thirdparty',
      },
    });
    integrations.push(integration);

    integration = this.create({
      _id : IntegrationId.Jtl,
      category: 'shopsystems',
      displayOptions: {
        icon: '#icon-jtl',
        title: 'JTL',
      },
      name: 'jtl',
      settingsOptions: {
        source: 'source',
      },
    });
    integrations.push(integration);

    integration = this.create({
      _id : IntegrationId.OpenCart,
      category: 'shopsystems',
      displayOptions: {
        icon: '#icon-opencart',
        title: 'OpenCart',
      },
      name: 'opencart',
      settingsOptions: {
        source: 'thirdparty',
      },
    });
    integrations.push(integration);

    integration = this.create({
      _id : IntegrationId.OroCommerce,
      category: 'shopsystems',
      displayOptions: {
        icon: '#icon-oro-commerce',
        title: 'OroCommerce',
      },
      name: 'oro_commerce',
      settingsOptions: {
        source: 'thirdparty',
      },
    });
    integrations.push(integration);

    integration = this.create({
      _id : IntegrationId.ShopwareCloud,
      category: 'shopsystems',
      displayOptions: {
        icon: '#icon-shopware-cloud',
        title: 'ShopwareCloud',
      },
      name: 'shopware_cloud',
      settingsOptions: {
        source: 'thirdparty',
      },
    });
    integrations.push(integration);

    integration = this.create({
      _id : IntegrationId.Shopware,
      category: 'shopsystems',
      displayOptions: {
        icon: '#icon-shopware',
        title: 'Shopware',
      },
      name: 'shopware',
      settingsOptions: {
        source: 'source',
      },
    });
    integrations.push(integration);

    integration = this.create({
      _id : IntegrationId.Connectin,
      category: 'shopsystems',
      displayOptions: {
        icon: '#icon-connectin',
        title: 'Connectin',
      },
      name: 'connectin',
      settingsOptions: {
        source: 'thirdparty',
      },
    });
    integrations.push(integration);

    integration = this.create({
      _id : IntegrationId.Smartstore,
      category: 'shopsystems',
      displayOptions: {
        icon: '#icon-smartstore',
        title: 'Smartstore',
      },
      name: 'smartstore',
      settingsOptions: {
        source: 'thirdparty',
      },
    });
    integrations.push(integration);

    return integrations;
  }

  public static createSantanderFactoringDePaymentIntegration(): IntegrationType {
    return this.create({
      _id : IntegrationId.SantanderFactoringDe,
      category: 'payments',
      displayOptions: {
        icon: '#icon-payment-option-santander',
        title: 'integrations.payments.santander_factoring_de.title',
      },
      name: 'santander_factoring_de',
      settingsOptions: {
        source: 'source',
      },
    });
  }

  public static createZiniaBnplPaymentIntegration(): IntegrationType {
    return this.create({
      _id : IntegrationId.ZiniaBnpl,
      category: 'payments',
      displayOptions: {
        icon: '#icon-payment-option-zinia',
        title: 'integrations.payments.zinia_bnpl.title',
      },
      name: 'zinia_bnpl',
      settingsOptions: {
        source: 'source',
      },
    });
  }

  public static createZiniaDEBnplPaymentIntegration(): IntegrationType {
    return this.create({
      _id : IntegrationId.ZiniaDEBnpl,
      category: 'payments',
      displayOptions: {
        icon: '#icon-payment-option-zinia-de',
        title: 'integrations.payments.zinia_bnpl_de.title',
      },
      name: 'zinia_bnpl_de',
      settingsOptions: {
        source: 'source',
      },
    });
  }

  public static createSantanderInvoiceDePaymentIntegration(): IntegrationType {
    return this.create({
      _id : IntegrationId.SantanderInvoiceDe,
      category: 'payments',
      displayOptions: {
        icon: '#icon-payment-option-santander',
        title: 'integrations.payments.santander_invoice_de.title',
      },
      name: 'santander_invoice_de',
      settingsOptions: {
        source: 'source',
      },
    });
  }

  public static createAllianzPaymentIntegration(): IntegrationType {
    return this.create({
      _id : IntegrationId.Allianz,
      category: 'payments',
      displayOptions: {
        icon: '#icon-payment-option-allianz',
        title: 'integrations.payments.allainz.title',
      },
      name: 'allianz_trade_b2b_bnpl',
      settingsOptions: {
        source: 'source',
      },
    });
  }

  public static createApplePayPaymentIntegration(): IntegrationType {
    return this.create({
      _id : IntegrationId.ApplePay,
      category: 'payments',
      displayOptions: {
        icon: '#icon-payment-option-apple-pay',
        title: 'integrations.payments.apple_pay.title',
      },
      name: 'apple_pay',
      settingsOptions: {
        source: 'source',
      },
    });
  }

  public static createSantanderB2BPaymentIntegration(): IntegrationType {
    return this.create({
      _id : IntegrationId.SantanderB2B,
      category: 'payments',
      displayOptions: {
        icon: '#icon-payment-option-psa_b2b_bnpl',
        title: 'integrations.payments.psa_b2b_bnpl.title',
      },
      name: 'psa_b2b_bnpl',
      settingsOptions: {
        source: 'source',
      },
    });
  }

  public static createZiniaLendingDePaymentIntegration(): IntegrationType {
    return this.create({
      _id : IntegrationId.ZiniaLendingDe,
      category: 'payments',
      displayOptions: {
        icon: '#icon-payment-option-zinia_lending_de',
        title: 'integrations.payments.zinia_lending_de.title',
      },
      name: 'zinia_lending_de',
      settingsOptions: {
        source: 'source',
      },
    });
  }

  public static createZiniaPosLendingDePaymentIntegration(): IntegrationType {
    return this.create({
      _id : IntegrationId.ZiniaPosLendingDe,
      category: 'payments',
      displayOptions: {
        icon: '#icon-payment-option-zinia_pos_lending_de',
        title: 'integrations.payments.zinia_pos_lending_de.title',
      },
      name: 'zinia_pos_lending_de',
      settingsOptions: {
        source: 'source',
      },
    });
  }

  public static createPaypalPaymentIntegration(): IntegrationType {
    return this.create({
      _id : IntegrationId.Paypal,
      category: 'payments',
      displayOptions: {
        icon: '#icon-payment-option-paypall',
        title: 'integrations.payments.paypal.title',
      },
      name: 'paypal',
      settingsOptions: {
        source: 'source',
      },
    });
  }

  public static createDhlShippingIntegration(): IntegrationType {
    return this.create({
      _id : IntegrationId.Dhl,
      category: 'shippings',
      displayOptions: {
        icon: '#icon-shipping-dhl-32',
        title: 'integrations.shippings.dhl.title',
      },
      name: 'dhl',
      settingsOptions: {
        source: 'source',
      },
    });
  }

  public static createTwilioCommunicationIntegration(): IntegrationType {
    return this.create({
      _id : IntegrationId.Twilio,
      category: 'communications',
      displayOptions: {
        icon: '#icon-communication-twillio',
        title: 'Twilio SMS',
      },
      name: 'twilio',
      settingsOptions: {
        source: 'source',
      },
    });
  }

  public static createNetsPaymentIntegration(): IntegrationType {
    return this.create({
      _id : IntegrationId.Nets,
      category: 'payments',
      displayOptions: {
        icon: '#icon-payment-option-nets',
        title: 'integrations.payments.nets.title',
      },
      name: 'nets',
      issuer: 'aci',
      settingsOptions: {
        source: 'source',
      },
    });
  }
}

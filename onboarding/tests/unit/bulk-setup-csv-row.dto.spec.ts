// tslint:disable-next-line: no-commented-code
// tslint:disable: object-literal-sort-keys
// tslint:disable: no-hardcoded-credentials

import { plainToClass } from 'class-transformer';
import { notContains, validateSync, ValidationError } from 'class-validator';

import { expect } from 'chai';

import { parseStylesTransformer, parseConnectSettingsCellDto } from '../../src/onboarding/transformers';
import { ConnectSettingsCellDto } from '../../src/onboarding/dto';
import { BulkSetupCsvRawRowInterface } from '../../src/onboarding/interfaces/incoming/bulk-setup-csv-row.interface';
import { SantanderSetupMessageDto } from '../../src/onboarding/dto/incoming/setup-message/santander-invoice-setup-message.dto';

describe('bulk-setup-csv-row', () => {
  let plain: BulkSetupCsvRawRowInterface;
  beforeEach(() => {
    plain = {
      'First Name': 'Ivan',
      'Last Name': 'Petrov',
      'Email': 'ivan@petrov.org',
      'Company': 'Petrov Ltd.',
      'Logo': 'petrov-log.png',
      'Language Code': 'PL',
      'Country Code': 'GB',
      'City': 'Warsaw',
      'Street': 'First',
      'Zip': '4412333',
      'Phone': '+38884123133',
      'Industry': 'Leather',
      'Product': 'Jacket',
      'Bank Name': 'Main Bank',
      'Bank Country Code': 'DE',
      'Bank City': 'Hamburg',
      'Bank Owner': 'Ambiant GMBH',
      'Bank BIC': 'Bank bic',
      'Bank IBAN': '412dqwdqwed12e',
      'Tax Id': '441233312',
      'Tax Number': '4412334123',
      'Tax Register Number': '44123123',
      'Tax Turnover Act': 'yes',
      'Contact Emails': 'petrov-ltd@gmail.com',
      'Theme': 'default',
      'Wallpaper': 'petrov-ltd-wallpaper.png',
      'Pos App': 'Yes',
      'Shop App': 'Yes',
      'Transactions App': 'Yes',
      'Products App': 'Yes',
      'Shipping App': '',
      'Checkout Logo': 'petrov-ltd-checkout-logo.png',
      'Checkout Styles': 'button.color=white&button.fill=true&button.text=text-value&page.background=black',
      'Connect Payment': [
        '12903iasndaskjndsakjdh@instant',
        'loginValue:passwordValue@santander_invoice_de?sender=senderIdValue&channel=channelId',
        'loginValug:passwordValug@santander_factoring_de?sender=senderIdValug&channel=channelIg',
        'device-payments?secondFactor=false&autoresponderEnabled=true&verificationType=0',
      ].join(';'),
      'Connect Communication': [
        'accountSidValue:authTokenValue@twilio',
        'qr?displayAvatar=false&type=png',
      ].join(';'),
      'Connect Shipping': '',
      'Connect Shopsystems': 'magento;shopify',
      'Connect Products': '',
      'Checkout Preset': '',
      'Onboarding Name': '',
      Template: '',
    };
  });
  it('should cast plain to dto', () => {
    expect(parseStylesTransformer(plain['Checkout Styles'])).to.contain({
      active: true,
      ['button.color']: 'white',
      ['button.fill']: 'true',
      ['button.text']: 'text-value',
      ['page.background']: 'black',
    });
    expect(parseConnectSettingsCellDto(plain['Connect Payment'])).to.deep.equal({
      instant: '12903iasndaskjndsakjdh@instant',
      santander_invoice_de: {
        channel: 'channelId',
        connectionName: undefined,
        login: 'loginValue',
        password: 'passwordValue',
        sender: 'senderIdValue',
      },
      santander_factoring_de: {
        channel: 'channelIg',
        connectionName: undefined,
        login: 'loginValug',
        password: 'passwordValug',
        sender: 'senderIdValug',
      },
      'device-payments': {
        autoresponderEnabled: true,
        secondFactor: false,
        verificationType: 0,
      },
    });
    expect(parseConnectSettingsCellDto(plain['Connect Communication'])).to.deep.equal({
      twilio: {
        accountSid: 'accountSidValue',
        authToken: 'authTokenValue',
      },
      qr: {
        displayAvatar: false,
        type: 'png',
      },
    });
    expect(parseConnectSettingsCellDto(plain['Connect Shopsystems'])).to.deep.equal({
      magento: { },
      shopify: { },
    });
  });
  it('should parse checkout styles', () => {
    plain['Checkout Styles'] = 'button.color=#164194&button.fill=true';
    expect(parseStylesTransformer(plain['Checkout Styles'])).to.deep.contains({
      active: true,
      ['button.color']: '#164194',
      ['button.fill']: 'true',
    });
  });
  it('PaymentsThirdPartyCsvCellDto', () => {
    expect(plainToClass(ConnectSettingsCellDto, {
      qr: 'qr?type=png',
    })).to.deep.equal({
      qr: {
        displayAvatar: undefined,
        type: 'png',
      },
    });
  });
  it('should throw on invalid values', () => {
    const connectPayment: string = 'login:pass@santander_invoice_de?sender=sender1&channel=channel1 :pass@santander_factoring_de?sender=sender2&channel=channel2';
    const parsed: ConnectSettingsCellDto = parseConnectSettingsCellDto(connectPayment);
    expect(parsed).to.deep.equal({
      santander_invoice_de: {
        login: 'login',
        password: 'pass',
        channel: 'channel1 :pass@santander_factoring_de?sender=sender2',
        connectionName: undefined,
        sender: 'sender1',
      },
    });
    const validationErrors: ValidationError[] = validateSync(parsed);
    expect(validationErrors[0]).to.nested.include({
      'children[0].constraints.stringNotContainChars': 'Value (channel1 :pass@santander_factoring_de?sender=sender2) contains forbidden characters ($&+,/:;=?@ "\'<>#%)',
      property: 'santander_invoice_de',
    });
  });
  it('should pass', () => {
    const connectPayment: string = '31ha07bc8146cf85eee414f8c89b862f:E44550B0@santander_invoice_de?sender=31HA07BC8146CF85EEE43013D1988342&channel=31HA07BC8146CF85EEE44C477C22D62F ;31ha07bc8146cf85eee414f8c89b862f:E44550B0@santander_factoring_de?sender=31HA07BC8146CF85EEE43013D1988342&channel=31HA07BC8146CF85EEE48DD6B72173C7';
    const parsed: ConnectSettingsCellDto = parseConnectSettingsCellDto(connectPayment);
    expect(parsed).to.deep.equal({
      santander_invoice_de: {
        login: '31ha07bc8146cf85eee414f8c89b862f',
        password: 'E44550B0',
        channel: '31HA07BC8146CF85EEE44C477C22D62F',
        connectionName: undefined,
        sender: '31HA07BC8146CF85EEE43013D1988342',
      },
      santander_factoring_de: {
        login: '31ha07bc8146cf85eee414f8c89b862f',
        password: 'E44550B0',
        channel: '31HA07BC8146CF85EEE48DD6B72173C7',
        connectionName: undefined,
        sender: '31HA07BC8146CF85EEE43013D1988342',
      },
    });
  });
  it('check validator', () => {
    const parsed: SantanderSetupMessageDto = plainToClass(SantanderSetupMessageDto, {
      connectionName: 'a',
      sender: 'b',
      login: 'c',
      password: 'd 2',
      channel: 'e f',
    });
    const validationErrors: ValidationError[] = validateSync(parsed);
    expect(validationErrors[0]).to.nested.include({
      'constraints.stringNotContainChars': 'Value (d 2) contains forbidden characters ($&+,/:;=?@ "\'<>#%)',
      property: 'password',
    });
  });
});

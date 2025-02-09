import { MailerEventController, MailerModule } from '../../src/mailer';
import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationModule } from '../../src/app.module';
import { EmailTemplatesType } from 'fixtures/email-templates';

describe('Single Email', () => {
  let mailerEventController: MailerEventController;

  const templateModel: {
    findOne: () => void;
  } = {
    findOne: () => {
    },
  };

  beforeAll(async () => {
    mockery.enable({
      warnOnUnregistered: false,
    });

    mockery.registerMock('nodemailer', nodemailerMock);

    const module: TestingModule = await Test.createTestingModule({
      imports: [ApplicationModule],
    })
      .overrideProvider('Template')
      .useValue(templateModel)
      .compile();

    mailerEventController = module.get<MailerEventController>(MailerEventController);
  });

  afterEach(async () => {
    nodemailerMock.mock.reset();
  });

  afterAll(async () => {
    mockery.deregisterAll();
    mockery.disable();
  });

  const emailBody: string = '<p>Hallo {{merchant.name}},</p>' +
    '<p>wir freuen uns, Ihnen mitteilen zu können, dass die Kreditanfrage' +
    '  ({{payment.total}}) für den oben' +
    '  genannten Kunden unter Vorbehalt genehmigt wurde. Sobald die Unterlagen bei der' +
    '  Bank eingegangen und abschließend geprüft sind, erhalten Sie nochmals eine' +
    '  Mitteilung und können den Versand vorbereiten.</p>' +
    '<p><strong>Einkauf bei:</strong> {{payment.business}}</p>' +
    '<p><strong>Kundenname:</strong> {{customer.name}}</p>' +
    '<p><strong>Anschrift:</strong> {{payment.address.fullAddress}}</p>' +
    '<p><strong>E-Mail-Adresse:</strong> {{customer.email}}</p>' +
    '{{#if application.number}}' +
    '<p><strong>Santander Antragsnummer:</strong> {{application.number}}</p>' +
    '{{/if}}' +
    '{{#if payment.items}}' +
    '<p>' +
    '  <strong>Warenkorb:</strong>' +
    '  {{#each payment.items}}' +
    '  {{this.quantity}}&times;&nbsp;{{this.name}}' +
    '  {{#unless @last}}, {{/unless}}' +
    '  {{/each}}' +
    '</p>' +
    '{{/if}} ';

  const emailMock: EmailTemplatesType = {
    _id: '',
    body: emailBody,
    description: 'Sends payment temporary approved status email to the merchant',
    layout: 'fb948fca-e8fa-40a4-8634-88844ed6710e',
    section: 'Santander',
    subject: 'Kunde {{ customer.name }} - Kreditanfrage ({{ payment.total }}) vorläufig genehmigt',
    template_name: 'santander_payment_status_temporary_approved_merchant',
    template_type: 'system',
    use_layout: true,
  };

  const findOneResult: Promise<EmailTemplatesType> 
    = new Promise((resolve: (value?: EmailTemplatesType) => void) => Promise.resolve(emailMock));
  jest.spyOn(templateModel, 'findOne').mockImplementation(() => findOneResult);

  it('Should send a single plain email', async () => {
    const dto: {
      data: {
          payload: {
              html: string;
              language: string;
              subject: string;
              to: string;
          };
      };
    } = {
      data: {
        payload: {
          html: '<html></html>',
          language: 'en',
          subject: 'my subject', 
          to: 'test@test.com',
        },
      },
    };

    await mailerEventController.onSingleMailSend(dto);
  });
});

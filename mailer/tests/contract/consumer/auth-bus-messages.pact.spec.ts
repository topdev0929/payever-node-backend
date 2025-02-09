import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { PePact, ExpectedMessageDto, asyncConsumerChecker } from '@pe/pact-kit';
import 'mocha';
import { BusinessMailDto, SingleMailDto } from '../../../src/mailer/dto';
import { ProvidersEnum } from '../config';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      businessId: Matchers.uuid(),
      templateName: 'staff_invitation_new',
      variables: {
        staff_invitation: {
          link: Matchers.like('some link'),
        },
      },
    },
    dtoClass: BusinessMailDto,
    name: 'payever.event.business.email',
  },
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      language: 'en',
      params: {
        login_location: {
          browser: Matchers.like('some browser name'),
          date: Matchers.iso8601DateTime(),
          ip: Matchers.like('some IP address'),
          os: Matchers.like('some os name'),
        },
        user: { email: Matchers.like('Some to addres of login new location event') },
      },
      subject: Matchers.like('Some subject of login new location event'),
      to: Matchers.like('Some to addres of login new location event'),
      type: 'login_new_location', // template name
    },
    dtoClass: SingleMailDto,
    name: 'payever.event.mailer.send.login_new_location',
  },
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      params: {
        code: Matchers.like('some code'),
        user: {
          firstName: Matchers.like('user first name'),
          lastName: Matchers.like('user last name'),
        },
      },
      subject: 'payever ID verification',
      to: Matchers.like('Some to addres of second factor event'),
      type: 'second-factor', // template name
    },
    dtoClass: SingleMailDto,
    name: 'payever.event.mailer.send.second-factor',
  },
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      language: 'en',
      params: {
        password_reset_url: Matchers.like('some reset url'),
      },
      subject: 'payever password reset',
      to: Matchers.like('Some to name'),
      type: 'passwordReset', // template name
    },
    dtoClass: SingleMailDto,
    name: 'payever.event.mailer.send.passwordReset',
  },
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      language: 'en',
      params: {
        password_set_url: Matchers.like('some set url'),
      },
      subject: 'payever account password set',
      to: Matchers.like('Some to name'),
      type: 'passwordSet', // template name
    },
    dtoClass: SingleMailDto,
    name: 'payever.event.mailer.send.passwordSet',
  },
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      language: 'en',
      params: {
        verificationLink: Matchers.term({
          generate: 'http://someurl.com/entry/confirmation/sometoken',
          matcher: 'http[s]*://[a-zA-Z0-9_-]+.[a-zA-Z0-9_-]+/entry/confirmation/[/?.:=&a-zA-Z0-9_-]+',
        }),
      },
      subject: 'payever account registration confirmation',
      to: Matchers.like('Some to name'),
      type: 'registerConfirmation', // template name
    },
    dtoClass: SingleMailDto,
    name: 'payever.event.mailer.send.registerConfirmation',
  },
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      language: 'en',
      params: {
        user: {
          first_name: Matchers.like('Some first name'),
          last_name: Matchers.like('Some last name'),
        },
      },
      subject: 'New user registered',
      to: Matchers.like('Some to name'),
      type: 'admin_registration_notice', // template name
    },
    dtoClass: SingleMailDto,
    name: 'payever.event.mailer.send.admin_registration_notice',
  },
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Auth);

describe('Receive auth bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});

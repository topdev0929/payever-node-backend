// tslint:disable: object-literal-sort-keys
import { InteractionObject, Matchers } from '@pact-foundation/pact';
import { BUSINESS_ID, UUID_REGEXP, ACCESS_TOKEN_EXAMPLE, JWT_TOKEN_REGEXP } from '../const';

export class PaymentThirdPartyInteractions {
  public static SantanderFormConnectInteraction(): InteractionObject {
    return {
      state: `Onboarded business ${BUSINESS_ID} created`,
      uponReceiving: 'a request to connect form',
      willRespondWith: {
        body: Matchers.like({
          id: Matchers.uuid(),
          form: Matchers.like({

          }),
        }),
        headers: {
          'Content-Type': Matchers.term({
            generate: 'application/json; charset=utf-8',
            matcher: '^application/json',
          }),
        },
        status: 200,
      },
      withRequest: {
        body: Matchers.like({
          login: Matchers.string('3bf509d8-9bd4-46a4-bfbd-13fd0fe909b3'),
          password: Matchers.string('0b985b234f06'),
          sender: Matchers.string('2beec07d-6fb4-407a-b20c-e42f1b5a5551'),
          channel: Matchers.string('c0d2ce2e-c790-48ae-a701-a09b43219cf1'),

          action: 'form-connect',
          connections: [],
        }),
        headers: {
          Authorization: Matchers.term({
            generate: `Bearer ${ACCESS_TOKEN_EXAMPLE}`,
            matcher: `^Bearer\\s${JWT_TOKEN_REGEXP}`,
          }),
          'Content-Type': Matchers.term({
            generate: 'application/json; charset=utf-8',
            matcher: '^application/json',
          }),
        },
        method: 'POST',
        path: Matchers.term({
          generate: `/api/business/${BUSINESS_ID}/integration/santander_invoice_de/action/form-connect`,
          matcher: `/api/business/${UUID_REGEXP}/integration/(santander_invoice_de|santander_factoring_de|santander_pos_factoring_de|santander_pos_invoice_de)/action/form-connect`,
        }),
      },
    };
  }

  public static SantanderFormSaveInteraction(): InteractionObject {
    return {
      state: 'keep previous state',
      uponReceiving: 'a request to save form',
      willRespondWith: {
        headers: {
          'Content-Type': Matchers.term({
            generate: 'application/json; charset=utf-8',
            matcher: '^application/json',
          }),
        },
        status: 200,
      },
      withRequest: {
        body: Matchers.like({
          action: 'payment-form-save',
          shopRedirectEnabled: false,
        }),
        headers: {
          'Content-Type': Matchers.term({
            generate: 'application/json; charset=utf-8',
            matcher: '^application/json',
          }),
        },
        method: 'POST',
        path: Matchers.term({
          generate: `/api/business/${BUSINESS_ID}/integration/santander_invoice_de/action/payment-form-save`,
          matcher: `/api/business/${UUID_REGEXP}/integration/(santander_invoice_de|santander_factoring_de|santander_pos_factoring_de|santander_pos_invoice_de)/action/payment-form-save`,
        }),
      },
    };
  }
}

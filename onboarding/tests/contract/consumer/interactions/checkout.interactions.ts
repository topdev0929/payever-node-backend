import { InteractionObject, Matchers } from '@pact-foundation/pact';

import { BUSINESS_ID, UUID_REGEXP, DEFAULT_CHECKOUT_ID, ACCESS_TOKEN_EXAMPLE, JWT_TOKEN_REGEXP } from '../const';

export class CheckoutInteractions {
  public static GetCheckoutsInteraction(): InteractionObject {
    return {
      state: `Onboarded business ${BUSINESS_ID} created`,
      uponReceiving: 'a request to get autocreated checkouts',
      willRespondWith: {
        body: Matchers.eachLike({
          _id: Matchers.term({
            generate: DEFAULT_CHECKOUT_ID,
            matcher: UUID_REGEXP,
          }),
          default: Matchers.boolean(true),
          settings: Matchers.like({ }),
        }),
        status: 200,
      },
      withRequest: {
        method: 'GET',
        path: Matchers.term({
          generate: `/api/business/${BUSINESS_ID}/checkout`,
          matcher: `/api/business/${UUID_REGEXP}/checkout`,
        }),
      },
    };
  }

  public static SetSettingsInteraction(): InteractionObject {
    return {
      state: 'keep previous state',
      uponReceiving: 'a request to update default checkout settings',
      willRespondWith: {
        status: 200,
      },
      withRequest: {
        body: Matchers.like({
          logo: Matchers.string('49562ddb-5268-4307-8b26-62f192f5f46c-logo.png'),
          settings: Matchers.like({
            styles: Matchers.like({
              buttonBackgroundColor: Matchers.string('#ffffff'),
              buttonTextColor: Matchers.string('#804020'),
              pageBackgroundColor: Matchers.string('#000000'),
            }),
          }),
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
        method: 'PATCH',
        path: Matchers.term({
          generate: `/api/business/${BUSINESS_ID}/checkout/${DEFAULT_CHECKOUT_ID}`,
          matcher: `/api/business/${UUID_REGEXP}/checkout/${UUID_REGEXP}$`,
        }),
      },
    };
  }

  public static SetIntegrationsInteraction(): InteractionObject {
    return {
      state: 'keep previous state',
      uponReceiving: 'a request to set checkout integration',
      willRespondWith: {
        status: 200,
      },
      withRequest: {
        method: 'PATCH',
        path: Matchers.term({
          generate: `/api/business/${BUSINESS_ID}/checkout/${DEFAULT_CHECKOUT_ID}/integration/qr/install`,
          matcher: `/api/business/${UUID_REGEXP}/checkout/${UUID_REGEXP}/integration/qr/install`,
        }),
      },
    };
  }
}

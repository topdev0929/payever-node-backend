import { InteractionObject, Matchers } from '@pact-foundation/pact';
import { BUSINESS_ID, UUID_REGEXP, ACTIVE_TERMINAL_ID, JWT_TOKEN_REGEXP, OLD_TOKEN_EXAMPLE, ACCESS_TOKEN_EXAMPLE } from '../const';

export class PosInteractions {
  public static GetTerminalsInteraction(): InteractionObject {
    return {
      state: `Onboarded business ${BUSINESS_ID} created`,
      uponReceiving: 'a request to get auto-created terminals',
      willRespondWith: {
        body: Matchers.eachLike({
          _id: Matchers.regex({
            generate: ACTIVE_TERMINAL_ID,
            matcher: UUID_REGEXP,
          }),
          active: Matchers.boolean(true),
        }),
        status: 200,
      },
      withRequest: {
        headers: {
          Authorization: Matchers.term({
            generate: `Bearer ${OLD_TOKEN_EXAMPLE}`,
            matcher: `^Bearer\\s${JWT_TOKEN_REGEXP}`,
          }),
        },
        method: 'GET',
        path: Matchers.term({
          generate: `/api/business/${BUSINESS_ID}/terminal`,
          matcher: `/api/business/${UUID_REGEXP}/terminal`,
        }),
      },
    };
  }

  public static SetIntegrationToTerminalInteraction(): InteractionObject {
    return {
      state: 'keep-previous-state',
      uponReceiving: 'a request to set default terminal integrations',
      willRespondWith: {
        status: 200,
      },
      withRequest: {
        headers: {
          Authorization: Matchers.term({
            generate: `Bearer ${ACCESS_TOKEN_EXAMPLE}`,
            matcher: `^Bearer\\s${JWT_TOKEN_REGEXP}`,
          }),
        },
        method: 'PATCH',
        path: Matchers.term({
          generate: `/api/business/${BUSINESS_ID}/terminal/${ACTIVE_TERMINAL_ID}/integration/qr/install`,
          matcher: `/api/business/${BUSINESS_ID}/terminal/${ACTIVE_TERMINAL_ID}/integration/(qr|device-payments)/install`,
        }),
      },
    };
  }
}

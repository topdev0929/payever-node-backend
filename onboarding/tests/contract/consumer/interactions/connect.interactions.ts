import { InteractionObject, Matchers } from '@pact-foundation/pact';
import { BUSINESS_ID, UUID_REGEXP, ACCESS_TOKEN_EXAMPLE, JWT_TOKEN_REGEXP } from '../const';

export class ConnectInteractions {
  public static InstallConnectAppsIneraction(): InteractionObject {
    return {
      state: `Onboarded business ${BUSINESS_ID} created`,
      uponReceiving: 'a request to install connect apps',
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
          generate: `/api/business/${BUSINESS_ID}/integration/qr/install`,
          matcher: `/api/business/${UUID_REGEXP}/integration/[^\/.]+/install`,
        }),
      },
    };
  }
}

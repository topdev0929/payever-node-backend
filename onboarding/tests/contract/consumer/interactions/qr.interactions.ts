import { InteractionObject, Matchers } from '@pact-foundation/pact';
import { BUSINESS_ID, UUID_REGEXP, ACCESS_TOKEN_EXAMPLE, JWT_TOKEN_REGEXP } from '../const';

export class QrInteractions {
  public static SetupQrInteraction(): InteractionObject {
    return {
      state: `Onboarded business ${BUSINESS_ID} created`,
      uponReceiving: 'a request save qr settings',
      willRespondWith: {
        status: 200,
      },
      withRequest: {
        body: Matchers.like({
          action: 'save',
          businessName: Matchers.string('Business #1 name'),
          displayAvatar: Matchers.boolean(true),
          type: Matchers.string('png'),
          url: Matchers.string('http://images.link/small.png'),
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
          generate: `/api/form/${BUSINESS_ID}/save`,
          matcher: `/api/form/${UUID_REGEXP}/save`,
        }),
      },
    };
  }
}

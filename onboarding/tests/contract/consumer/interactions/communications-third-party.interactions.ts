import { InteractionObject, Matchers } from '@pact-foundation/pact';
import { BUSINESS_ID, UUID_REGEXP, JWT_TOKEN_REGEXP, ACCESS_TOKEN_EXAMPLE } from '../const';

export class CommunicationsThirdPartyInteractions {
  public static TwilioSetupInteraction(): InteractionObject {
    return {
      state: `Onboarded business ${BUSINESS_ID} created`,
      uponReceiving: 'a request to connect form',
      willRespondWith: {
        body: Matchers.like({
          id: Matchers.regex({
            generate: BUSINESS_ID,
            matcher: UUID_REGEXP,
          }),
          name: Matchers.regex({
            generate: BUSINESS_ID,
            matcher: UUID_REGEXP,
          }),

          form: Matchers.like({
            actionContext: Matchers.like({ }),
            content: Matchers.like({ }),
            contentType: 'accordion',
            title: 'Twilio',
            type: 'info-box',
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
          accountSid: Matchers.string('-account-sid-value-'),
          action: 'form-connect',
          authToken: Matchers.string('-auth-token-value-'),
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
          generate: `/api/business/${BUSINESS_ID}/integration/twilio/action/form-connect`,
          matcher: `/api/business/${UUID_REGEXP}/integration/twilio/action/form-connect`,
        }),
      },
    };
  }
}

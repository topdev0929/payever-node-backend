import { InteractionObject, Matchers } from '@pact-foundation/pact';
import { BUSINESS_ID, UUID_REGEXP, ACCESS_TOKEN_EXAMPLE, JWT_TOKEN_REGEXP } from '../const';

export class DevicePaymentsInteractions {
  public static DevicePaymentsSetup(): InteractionObject {
    return {
      state: `Onboarded business ${BUSINESS_ID} created`,
      uponReceiving: 'a request to set device-payments settings',
      willRespondWith: {
        body: Matchers.like({
          autoresponderEnabled: Matchers.boolean(false),
          enabled: Matchers.boolean(true),
          secondFactor: Matchers.boolean(false),
          verificationType: Matchers.decimal(1),
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
          autoresponderEnabled: Matchers.boolean(false),
          secondFactor: Matchers.boolean(false),
          verificationType: Matchers.decimal(1),
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
        method: 'PUT',
        path: Matchers.term({
          generate: `/api/v1/${BUSINESS_ID}/settings`,
          matcher: `/api/v1/${UUID_REGEXP}/settings`,
        }),
      },
    };
  }
}

import { InteractionObject, Matchers } from '@pact-foundation/pact';

import {
  BUSINESS_ID,
  UUID_REGEXP,
  JWT_TOKEN_FULL_REGEXP,
  ACCESS_TOKEN_EXAMPLE,
  REFRESH_TOKEN_EXAMPLE,
  JWT_TOKEN_REGEXP,
  OLD_TOKEN_EXAMPLE,
  USER_ID,
} from '../const';

export class AuthInterations {
  public static GrantBusinessAccessInteraction(): InteractionObject {
    return {
      state: `Onboarder user with id ${USER_ID} exists`,
      uponReceiving: 'a request to pre-grant access to not-existing business',
      willRespondWith: {
        body: {
          accessToken: Matchers.term({
            generate: ACCESS_TOKEN_EXAMPLE,
            matcher: JWT_TOKEN_FULL_REGEXP,
          }),
          refreshToken: Matchers.term({
            generate: REFRESH_TOKEN_EXAMPLE,
            matcher: JWT_TOKEN_FULL_REGEXP,
          }),
        },
        headers: {
          'Content-Type': Matchers.term({
            generate: 'application/json; charset=utf-8',
            matcher: '^application/json',
          }),
        },
        status: 200,
      },
      withRequest: {
        body: { },
        headers: {
          Authorization: Matchers.term({
            generate: `Bearer ${OLD_TOKEN_EXAMPLE}`,
            matcher: `^Bearer\\s${JWT_TOKEN_REGEXP}`,
          }),
        },
        method: 'PUT',
        path: Matchers.term({
          generate: `/api/${BUSINESS_ID}`,
          matcher: `/api/${UUID_REGEXP}`,
        }),
      },
    };
  }
}

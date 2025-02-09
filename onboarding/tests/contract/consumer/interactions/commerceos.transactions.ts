import { InteractionObject, Matchers } from '@pact-foundation/pact';

import { BUSINESS_ID, UUID_REGEXP, ACCESS_TOKEN_EXAMPLE, JWT_TOKEN_REGEXP } from '../const';

export class CommerceosInterations {
  public static GetOnboardingInteraction(): InteractionObject {
    return {
      state: 'db contains santander onboarding',
      uponReceiving: 'a request to get santander onboarding steps',
      willRespondWith: {
        body: Matchers.like({
          afterRegistration: [{
            payload: {
              apps: Matchers.eachLike({
                app: Matchers.term({
                  generate: 'c1c70ee9-61d3-41b4-8b01-cd753a7fc202',
                  matcher: UUID_REGEXP,
                }),
                code: Matchers.term({
                  generate: 'connect',
                  matcher: '.+',
                }),
                installed: true,
              }),
            },
          }],
        }),
        status: 200,
      },
      withRequest: {
        method: 'GET',
        path: Matchers.term({
          generate: `/api/onboarding/cached/santander`,
          matcher: `/api/onboarding/cached/santander`,
        }),
      },
    };
  }

  public static ToggleAppsInstalledInteraction(): InteractionObject {
    return {
      state: 'keep previous state',
      uponReceiving: 'a request to pre-install apps before business created',
      willRespondWith: {
        body: null,
        status: 201,
      },
      withRequest: {
        body: {
          apps: Matchers.eachLike({
            app: Matchers.term({
              generate: 'c1c70ee9-61d3-41b4-8b01-cd753a7fc202',
              matcher: UUID_REGEXP,
            }),
            code: Matchers.term({
              generate: 'connect',
              matcher: '.+',
            }),
            installed: true,
          }),
        },
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
          generate: `/api/apps/business/${BUSINESS_ID}/toggle-installed`,
          matcher: `/api/apps/business/${UUID_REGEXP}/toggle-installed`,
        }),
      },
    };
  }
}

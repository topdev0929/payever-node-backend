import { InteractionObject, Matchers } from '@pact-foundation/pact';
import { BUSINESS_ID, UUID_REGEXP, ACCESS_TOKEN_EXAMPLE, JWT_TOKEN_REGEXP } from '../const';

export class WallpapersInteractions {
  public static SetWallpaperInteraction(): InteractionObject {
    return {
      state: undefined,
      uponReceiving: 'a request to set business wallpaper',
      willRespondWith: {
        status: 201,
      },
      withRequest: {
        body: Matchers.like({
          industry: Matchers.string('fashion'),
          theme: Matchers.string('default'),
          wallpaper: Matchers.string('8af60e5b-df5a-453c-a77e-54087df8812e-wallpaper.jpg'),
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
          generate: `/api/business/${BUSINESS_ID}/wallpapers/active`,
          matcher: `/api/business/${UUID_REGEXP}/wallpapers/active`,
        }),
      },
    };
  }
}

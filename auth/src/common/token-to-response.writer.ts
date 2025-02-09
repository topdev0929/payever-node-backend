import { Injectable } from '@nestjs/common';
import { TokensResultModel } from '@pe/nest-kit';
import { CookiesObject, FastifyResponse } from './interfaces';
import { environment } from '../environments';

const domain: string = environment.oauthTokenInCookie.domain;

@Injectable()
export class TokenCookieWriter {
  public setTokenToCookie(
    response: FastifyResponse,
    tokenResult: TokensResultModel,
    maxAge: number = 2592000,
  ): void {
    const cookiesToSet: CookiesObject = { };
    if (tokenResult.accessToken !== undefined) {
      cookiesToSet.pe_auth_token = tokenResult.accessToken;
    }
    cookiesToSet.pe_refresh_token = tokenResult.refreshToken;

    response.header(
      'Set-Cookie',
      `${this.cookiesObjectToString(cookiesToSet)};domain=.${domain};path=/;Max-Age=${maxAge};SameSite=None;Secure`);
  }

  public unsetTokenInCookie(
    response: FastifyResponse,
  ): void {
    this.setTokenToCookie(
      response,
      {
        accessToken: '',
        refreshToken: '',
      },
      0,
    );
  }

  private cookiesObjectToString(cookiesObject: CookiesObject): string {
    return Object.entries(cookiesObject).map(([key, value]: [string, string]) => {
      return `${key}=${value}`;
    }).join(';');
  }
}

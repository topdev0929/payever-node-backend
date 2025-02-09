import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { environment } from '../environments';
import { SocialUserDto } from './dtos';

@Injectable()
export class GoogleLoginStrategy extends PassportStrategy(Strategy, 'google_login') {

  constructor() {
    super({
      callbackURL: `${environment.googleRedirectUrl}/login`,
      clientID: environment.googleClientId,
      clientSecret: environment.googleClientSecret,
      scope: ['email', 'profile'],
    });
  }

  public async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    if (!profile?.emails?.length) {
      return;
    }
    const user: SocialUserDto = {
      accessToken,
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      id: profile.id,
      lastName: profile.name.familyName,
      middleName: '',
    };

    done(null, user);
  }
}

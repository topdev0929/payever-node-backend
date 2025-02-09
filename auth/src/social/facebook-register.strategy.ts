import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { environment } from '../environments';
import { SocialUserDto } from './dtos';

@Injectable()
export class FacebookRegisterStrategy extends PassportStrategy(Strategy, 'facebook_register') {
  constructor() {
    super({
      callbackURL: `${environment.fbRedirectUrl}/register`,
      clientID: environment.fbAppId,
      clientSecret: environment.fbAppSecret,
      profileFields: ['emails', 'name'],
      scope: 'email',
    });
  }

  public async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    if (!profile) {
      return;
    }
    const user: SocialUserDto = {
      accessToken,
      email: !profile.emails?.length ? 
        `${profile.firstName}${profile.lastName}@facebook.com` 
        : profile.emails[0].value,
      firstName: profile.name?.givenName,
      id: profile.id,
      lastName: profile.name?.familyName,
      middleName: profile.name?.middleName,
    };

    done(null, user);
  }
}

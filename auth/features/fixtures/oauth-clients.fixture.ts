import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Document, Model } from 'mongoose';
import { OAuthClient } from '../../src/oauth/interfaces';

class OauthClientsFixture extends BaseFixture {
  private readonly model: Model<OAuthClient & Document> = this.application.get('OAuthClientModel');

  public async apply(): Promise<void> {
    await this.model.create({
      _id: '10276_4r9ki908848w844scwcwooo0swwcggg8csows8cwsso8swgsk4',
      accessTokenLifetime: 3600,
      businesses: ['fe593efa-c439-44be-9eaa-52c78962c817'],
      grants: [
        'token',
        'authorization_code',
        'refresh_token',
        'client_credentials',
        'http://www.payever.de/api/payment',
        'http://www.payever.de/api/merchant',
        'http://www.payever.de/rest',
      ],
      isActive: true,
      name: 'BB',
      redirectUri: '',
      refreshTokenLifetime: 1209600,
      scopes: [
        'API_CREATE_PAYMENT',
      ],
      secret: '3vxgud9q10o48w8socow4cwogw48c8cwscw4gos48o00wo4gkg',
      user: 'b5965f9d-5971-4b02-90eb-537a0a6e07c7',
    });
  }
}

export = OauthClientsFixture;

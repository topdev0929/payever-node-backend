import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseFixture } from '@pe/cucumber-sdk/module';
import { OrganizationModel, OrganizationSchemaName } from '../../src/organization';
import { OAuthClient } from '../../src/oauth';

class OrganizationsFixture extends BaseFixture {
  private readonly organizationModel: Model<OrganizationModel> =
    this.application.get(getModelToken(OrganizationSchemaName));
  private readonly oauthModel: Model<OAuthClient & Document> = this.application.get('OAuthClientModel');

  public async apply(): Promise<void> {
    await this.organizationModel.create({
      _id: '6391e66e-2416-4e1f-b09c-88e57bb019c0',
      name: 'Adyen',
    });

    await this.oauthModel.create({
      _id: '74b58859-3a62-4b63-83d6-cc492b2c8e29',
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
      organization: '6391e66e-2416-4e1f-b09c-88e57bb019c0',
      redirectUri: '',
      refreshTokenLifetime: 1209600,
      scopes: [
        'API_CREATE_PAYMENT',
      ],
      secret: '09d1fdca-f692-4609-bc2d-b3003a24c30a',
      user: 'b5965f9d-5971-4b02-90eb-537a0a6e07c7',
    });
  }
}

export = OrganizationsFixture;

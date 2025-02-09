import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OAuthTokenSchemaName } from '../schemas';
import { OAuthTokenModel } from '../models';
import { OAuthTokenEventDto } from '../dto/oauth-token';

@Injectable()
export class OAuthTokenService {
  constructor(
    @InjectModel(OAuthTokenSchemaName) private readonly oauthTokenModel: Model<OAuthTokenModel>,
  ) { }

  public async createOAuthTokenFromEvent(data: OAuthTokenEventDto): Promise<OAuthTokenModel> {
    return this.oauthTokenModel.create({
      ...data,
      businessIds: data.businesses,
    });
  }
}

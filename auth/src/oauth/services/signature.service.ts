import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

import { OAuthClientSignAlgorythms } from '../enum';
import { OAuthClient } from '../interfaces';

@Injectable()
export class SignatureService {
  constructor() { }

  public verify(algorythm: OAuthClientSignAlgorythms, message: string, key: string, signature: string): boolean {
    const generatedSignature: string = this.sign(algorythm, message, key);

    return generatedSignature === signature;
  }

  public sign(algorythm: OAuthClientSignAlgorythms, message: string, key: string): string {
    switch (algorythm) {
      case OAuthClientSignAlgorythms.hmac_sha256:
        return crypto
          .createHmac('sha256', key)
          .update(message)
          .digest('hex');
      case OAuthClientSignAlgorythms.md5:
        const update: string = this.substituteOauthParams(message, key);

        return crypto
          .createHash('md5')
          .update(update)
          .digest('hex');
      default:
        return null;
    }
  }

  public substituteOauthParams(message: string, clientSecret: string): string {
    return message.replace('#client_secret', clientSecret);
  }
}

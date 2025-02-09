import { After, Before, When } from '@cucumber/cucumber';
import * as crypto from 'crypto';

import { ContextInterface } from '@pe/cucumber-sdk';
import { SharedStorage } from '@pe/cucumber-sdk/module/storage';

import { environment } from '../../src/environments';

export class PasswordContext implements ContextInterface {
  public resolve(): void {
    When(/^generating new encrypted string using password "([^"]*)" and remember as "([^"]*)"/, async (
      password: string,
      keyToStore: string,
    ): Promise<void> => {
      const stringToEncrypt: string = `${password}|${Date.now()}`;

      const publicKey: string = await PasswordContext.getPublicKey();
      const encryptedString: Buffer = crypto.publicEncrypt(
        {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_PADDING,
        },
        Buffer.from(stringToEncrypt),
      );

      SharedStorage.set(keyToStore, encryptedString.toString('base64'));
    });
  }

  private static async getPublicKey(): Promise<string> {
    const pubKeyObject: crypto.KeyObject = crypto.createPublicKey({
      format: 'pem',
      key: environment.encryption.masterKey,
    });

    return pubKeyObject.export({
      format: 'pem',
      type: 'pkcs1',
    }).toString();
  }
}

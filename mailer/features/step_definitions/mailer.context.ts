import { AbstractWorld, ContextInterface } from '@pe/cucumber-sdk';
import { AssertionError } from 'chai';
import { After, Before, Then, ITestStepHookParameter } from '@cucumber/cucumber';

import { MailerStorage } from './mailer.storage';

export class MailerContext implements ContextInterface {
  public resolve(): void {
    Before(async function(scenario: ITestStepHookParameter): Promise<void> {
      await this.init(scenario);
    });

    After(async function(): Promise<void> {
      await this.close();
    });

    Then(/^print sent mails list$/, function(): void {
      this.attach(
        JSON.stringify(
          MailerStorage.getMailsList(),
          null,
          2,
        ),
      );
    });

    Then(/^a mail with the following data should (not )?be sent:$/, async function(
      this: AbstractWorld,
      not: string,
      data: string,
    ): Promise<void> {
      const should: boolean = not !== 'not ';
      data = JSON.parse(data);
      const exists: boolean = MailerStorage.exists([data]);

      if (!((should && exists) || (!should && !exists))) {
        throw new AssertionError('A mail with the specified data ' + (should ? 'not ' : '') + 'found.');
      }
    });
  }
}

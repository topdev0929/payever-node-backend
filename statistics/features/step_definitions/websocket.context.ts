import { After, Before, Then, When } from '@cucumber/cucumber';
import { AbstractWorld, ContextInterface } from '@pe/cucumber-sdk';
import { WEBSOCKET_PROVIDER_NAME, WebsocketProvider } from './websocket.provider';
import { SharedStorage } from '@pe/cucumber-sdk/module/storage';
import { JsonAssertion } from '@pe/cucumber-sdk/module/tools';
import { AssertionError } from 'chai';

export class WebsocketContext implements ContextInterface {
  public resolve(): void {

    Before(async function (scenario: any): Promise<void> {
      await this.init(scenario);
    });

    After(async function (): Promise<void> {
      await this.close();
    });

    When(
      /^I send a Websocket request with json:/, async function (
        this: AbstractWorld,
        jsonString: string,
    ): Promise<any> {
      await this.getProvider<WebsocketProvider>(WEBSOCKET_PROVIDER_NAME).send(
        SharedStorage.replacePlaceholders(jsonString)
      );
    });

    Then(/^the Websocket response should contain json:$/, function(
        this: AbstractWorld,
        jsonString: string,
      ): void {
      const expected: {} = JSON.parse(SharedStorage.replacePlaceholders(jsonString));
      const actual: any = this.getProvider<WebsocketProvider>(WEBSOCKET_PROVIDER_NAME).getResponse();

      if (JSON.stringify(actual).length < JSON.stringify(expected).length) {
        throw new AssertionError('Response does not contain such json.');
      }

      JsonAssertion.assertContains(actual, expected);
      });

    Then(
        /^print last Websocket response$/, async function (
          this: AbstractWorld,
     ): Promise<any> {
      this.attach(JSON.stringify(
        this.getProvider<WebsocketProvider>(WEBSOCKET_PROVIDER_NAME).getResponse(),
        null,
        2,
      ));
    });
  }
}

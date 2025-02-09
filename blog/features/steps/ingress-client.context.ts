import { After, Before, Given } from '@cucumber/cucumber';
import { AbstractWorld, ContextInterface } from '@pe/cucumber-sdk';
import { SharedStorage } from '@pe/cucumber-sdk/module/storage';
import { INGRESS_CLIENT_PROVIDER, IngressClientProvider } from '../mocks/ingress-client/ingress-client.provider';
import { IngressCallsStorage } from '../mocks/ingress-client/ingress-calls.storage';
import { AssertionError } from 'chai';

export class IngressClientContext implements ContextInterface {
  public resolve(): any {
    Before(async function(scenario: any): Promise<void> {
      await this.init(scenario);
    });

    After(async function(): Promise<void> {
      const unmockedCalls: any = IngressCallsStorage.getUnmockedCalls();
      if (unmockedCalls.length > 0) {
        this.attach(getUnmockedCallsString(unmockedCalls));
        throw new AssertionError('Unmocked ingress client calls found');
      }
      IngressCallsStorage.clear();

      await this.close();
    });

    Given(/^(?:I )?mock "(.+)" method of ingress client with parameters:$/, async function(
      this: AbstractWorld,
      methodName: string,
      parameters: string,
    ): Promise<void> {
      parameters = SharedStorage.replacePlaceholders(parameters);
      const jsonParameters: any = JSON.parse(parameters);

      this.getProvider<IngressClientProvider>(INGRESS_CLIENT_PROVIDER).mockMethod(
        methodName,
        jsonParameters,
      );
    });

    function getUnmockedCallsString(unMockedCalls: any[]): string {
      return '\n\u001b[31;1mIngress Client Unmocked Calls:\u001b[0m\n' + JSON.stringify(unMockedCalls, null, 2);
    }
  }
}

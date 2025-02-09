import { JsonAssertion } from '@pe/cucumber-sdk';
import { IngressCallsStorage } from './ingress-calls.storage';

export class IngressClientMock{


  public post(payload: any): void {
    return this.getMockedCall('post', payload);
  }

  public delete(): void {
    return this.getMockedCall('delete', null);
  }

  public mockMethod(method: string, parameters: any, result: any): void {
    IngressCallsStorage.mockMethod(method, parameters, result);
  }

  private getMockedCall(methodName: string, args: any = null): any {
    for (const call of IngressCallsStorage.getMockedCalls()) {
      if (call.method !== methodName) {
        continue;
      }

      if (args === call.arguments || JsonAssertion.contains(args, call.arguments)) {
        return call.result;
      }
    }

    IngressCallsStorage.addUnmockedCall(methodName, args);
  }
}

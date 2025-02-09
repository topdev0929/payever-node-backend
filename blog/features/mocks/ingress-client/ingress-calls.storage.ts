import { MockedCall } from './mocked-call.interface';

export class IngressCallsStorage {
  private static mockedCalls: MockedCall[] = [];
  private static unmockedCalls: any[] = [];


  public static getUnmockedCalls(): any[] {
    return this.unmockedCalls;
  }

  public static getMockedCalls(): MockedCall[] {
    return this.mockedCalls;
  }

  public static clear(): void {
    this.mockedCalls = [];
    this.unmockedCalls = [];
  }

  public static mockMethod(method: string, parameters: any, result: any): void {
    this.mockedCalls.push({
      arguments: parameters,
      method,
      result: result,
    });
  }

  public static addUnmockedCall(method: string, parameters: any): void {
    this.unmockedCalls.push({
      arguments: parameters,
      method,
    });
  }
}

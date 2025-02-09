import { AssertionError } from 'chai';
import { After, Before, Then } from '@cucumber/cucumber';
import { ContextInterface } from '@pe/cucumber-sdk';
import { SharedStorage } from '@pe/cucumber-sdk/module/storage';

export class CustomStorageContext implements ContextInterface {
  public resolve(): void {
    Before(() => {
      SharedStorage.clear();
    });

    After(() => {
      SharedStorage.clear();
    });

    Then(/^stored value "([^"]*)" should be equal to value :$/, (key: string, data: any) => {
      const value: string = SharedStorage.get(key);
      if(data === 'null'){
        data = null;
      }
      if (value) {
        throw new AssertionError(`Storage value "${key}" does exist.`);
      }
      if (value != data) {
        throw new AssertionError(`Storage value "${key}" not equal.`);
      }
    });
  }
}

import { ContextInterface, AbstractWorld } from '@pe/cucumber-sdk';
import { After, Before, Then } from '@cucumber/cucumber';
import { AzureStub, AZURE_STUB_NAME } from './azure.stub';
import { SharedStorage } from '@pe/cucumber-sdk/module/storage';
import * as azurestorage from 'azure-storage';


export class AzureContext implements ContextInterface {
  public resolve(): void {
    Before(async function (scenario: any): Promise<void> {
      await this.init(scenario);
    });

    After(async function (): Promise<void> {
      await this.close();
    });

    Then(/^I read blob with id "([^"]*)" as string and remember as "([^"]*)"$/, async function (
      this: AbstractWorld,
      blob: string,
      storageKey: string,
    ): Promise<void> {
      const blobService: AzureStub = this.getProvider<AzureStub>(AZURE_STUB_NAME);
      const content: string = blobService.getBlob(SharedStorage.replacePlaceholders(blob));
      SharedStorage.set(storageKey, content);
    });
  }
}

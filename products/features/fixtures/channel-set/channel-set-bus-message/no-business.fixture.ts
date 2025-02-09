import { BaseFixture } from '@pe/cucumber-sdk';

class NoBusinessFixture extends BaseFixture {
  public async apply(): Promise<void> { }
}

export = NoBusinessFixture;

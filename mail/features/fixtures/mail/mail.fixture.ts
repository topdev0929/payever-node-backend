import { MailFixtureBase } from './mail.fixture.base';

class MailFixture extends MailFixtureBase {
  public async apply(): Promise<void> {
    await super.apply();
  }
}

export = MailFixture;

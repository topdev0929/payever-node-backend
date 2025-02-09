import { MailFixtureBase } from './mail.fixture.base';
import { BusinessFactory } from '../factories';

class MailFixture extends MailFixtureBase {
  public async apply(): Promise<void> {
    await super.apply();
    await this.businessModel.create(BusinessFactory.create({
      _id: 'aaaaaaaa-aaaa-aaaa-bbbb-aaaaaaaaaaaa',
    }));
  }
}

export = MailFixture;

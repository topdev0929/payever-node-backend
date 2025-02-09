import { DomainFixtureBase, DOMAIN_ID, BLOG_ID } from './domain.fixture.base';
class DeleteDomainFixture extends DomainFixtureBase {
  public async apply(): Promise<void> {
    await super.apply();

    await this.domainModel.create({
      _id: DOMAIN_ID,
      name: 'test.domain',
      blog: BLOG_ID,
      isConnected: false,
    });
  }
}

export = DeleteDomainFixture;

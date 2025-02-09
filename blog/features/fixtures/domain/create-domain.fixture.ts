import { DomainFixtureBase } from './domain.fixture.base';

class UpdateBlogAccessAlreadyLiveFixture extends DomainFixtureBase {
  
  public async apply(): Promise<void> {
    await super.apply();
  }
}

export = UpdateBlogAccessAlreadyLiveFixture;

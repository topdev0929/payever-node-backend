import { DomainFixtureBase, BLOG_ID } from './domain.fixture.base';
import { BlogAccessConfigFactory, BlogFactory } from '../factories';

class GetListFixture extends DomainFixtureBase {
  public async apply(): Promise<void> {
    await super.apply();

    await this.blogAccessConfigModel.create(BlogAccessConfigFactory.create({
        blog: BLOG_ID,
        isLive: true,
        ownDomain: 'test.domain.1',
        internalDomain: 'testdomain.1'
  }));
  }
}

export = GetListFixture;

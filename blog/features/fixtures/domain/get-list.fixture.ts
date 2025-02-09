import { DomainFixtureBase, BLOG_ID } from './domain.fixture.base';

import { BUSINESS_ID, CHANNEL_SET_ID } from './domain.fixture.base';

const DOMAIN_ID_1: string = '11111111-1111-1111-1111-111111111111';
const DOMAIN_ID_2: string = '22222222-2222-2222-2222-222222222222';

class GetListFixture extends DomainFixtureBase {
  public async apply(): Promise<void> {
    await super.apply();

    await this.domainModel.create({
      _id: DOMAIN_ID_1,
      name: 'test.domain.1',
      blog: BLOG_ID,
      isConnected: false,
    });

    await this.domainModel.create({
      _id: DOMAIN_ID_2,
      name: 'test.domain.2',
      blog: BLOG_ID,
      isConnected: false,
    });
  }
}

export = GetListFixture;

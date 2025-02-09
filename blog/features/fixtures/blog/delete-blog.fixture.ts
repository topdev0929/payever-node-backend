import { BusinessFactory, ChannelSetFactory,  BlogAccessConfigFactory, BlogFactory } from '../factories';
import { BUSINESS_ID, CHANNEL_ID, CHANNEL_SET_ID, BlogFixtureBase, BLOG_ID } from './blog.fixture.base';

const ANOTHER_BUSINESS_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const CHANNEL_SET_ID_1: string = 'dddddddd-dddd-dddd-dddd-dddddddddddd';
const CHANNEL_SET_ID_2: string = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';

class DeleteBlogFixture extends BlogFixtureBase {
  public async apply(): Promise<void> {
    await super.apply();

    const anotherchannelSet1 = await this.channelSetModel.create(ChannelSetFactory.create({
      _id: CHANNEL_SET_ID_1,
      channel: CHANNEL_ID,
    }));

    const anotherchannelSet2 = await this.channelSetModel.create(ChannelSetFactory.create({
      _id: CHANNEL_SET_ID_2,
      channel: CHANNEL_ID,
    }));

    await this.businessModel.create(BusinessFactory.create({
      _id: ANOTHER_BUSINESS_ID,
    }));
    
    await this.blogModel.create(BlogFactory.create({
      _id: BLOG_ID,
      business: BUSINESS_ID,
      channelSet: CHANNEL_SET_ID,
      name: 'Test update',
    }));

    await this.blogAcessConfigModel.create(BlogAccessConfigFactory.create({
      blog: BLOG_ID,
    }));

    await this.blogModel.create(BlogFactory.create({
      business: BUSINESS_ID,
      channelSet: CHANNEL_SET_ID,
      name: 'Another blog',
    }));
  }
}

export = DeleteBlogFixture;

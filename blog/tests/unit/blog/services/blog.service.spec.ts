import { HttpException } from '@nestjs/common';
import {
  AbstractChannelSetService,
  ChannelEventMessagesProducer,
  ChannelService,
  ChannelSetModel,
} from '@pe/channels-sdk';
import { EventDispatcher, RedisClient } from '@pe/nest-kit';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'mocha';
import * as mongoose from 'mongoose';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';
import 'sinon-mongoose';
import { BusinessModel } from '../../../../src/business';
import {
  CreateBlogDto,
  BlogModel,
  BlogService,
  UpdateBlogDto,
  BlogAccessConfigModel,
  BlogAccessConfigService,
} from '../../../../src/blog';
import { BlogRabbitEventsProducer } from '../../../../src/blog/producers';
import { BlogEventsEnum as BlogEvent } from '../../../../src/blog/enums';
import { businessFixture } from '../../fixtures/businessFixture';
import { channelSetFixture } from '../../fixtures/channelSetFixture';
import { mongooseModelFixture } from '../../fixtures/mongooseModelFixture';
import { servicesFixture } from '../../fixtures/servicesFixture';
import { blogFixture } from '../../fixtures/blogFixture';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

// tslint:disable-next-line:no-big-function
describe('BlogService', async (): Promise<void> => {
  let sandbox: sinon.SinonSandbox;

  let testService: BlogService;

  let channelService: ChannelService;
  let channelSetService: AbstractChannelSetService;
  let channelEventMessagesProducer: ChannelEventMessagesProducer;
  let blogEventsProducer: BlogRabbitEventsProducer;
  let eventDispatcher: EventDispatcher;
  let blogAccessConfigService: BlogAccessConfigService;
  let redisClient: RedisClient;

  let blogModel: mongoose.Model<BlogModel>;
  let businessModel: mongoose.Model<BusinessModel>;
  let blogAccessConfigModel: mongoose.Model<BlogAccessConfigModel>;

  before(
    async (): Promise<void> => {
      channelService = servicesFixture.getChannelService();
      channelSetService = servicesFixture.getAbstractChannelSetService();
      channelEventMessagesProducer = servicesFixture.getChannelEventMessagesProducer();
      blogEventsProducer = servicesFixture.getBlogRabbitEventsProducer();
      eventDispatcher = servicesFixture.getEventDispatcher();

      blogModel = mongooseModelFixture.getModelMock();
      businessModel = mongooseModelFixture.getModelMock();
      blogAccessConfigModel = mongooseModelFixture.getModelMock();
      blogAccessConfigService = new BlogAccessConfigService(blogAccessConfigModel, eventDispatcher);

      testService = new BlogService(
        blogModel,
        blogAccessConfigModel,
        businessModel,
        channelService,
        channelSetService,
        channelEventMessagesProducer,
        blogEventsProducer,
        eventDispatcher,
        blogAccessConfigService,
        redisClient,
      );
    },
  );

  beforeEach(
    async (): Promise<void> => {
      sandbox = sinon.createSandbox();
    },
  );

  afterEach(
    async (): Promise<void> => {
      sandbox.restore();
      sandbox = undefined;
    },
  );

  describe('create', (): void => {
    it('ok', async (): Promise<void> => {
      const blogDTO: CreateBlogDto = blogFixture.getCreateDTO();
      const blog: BlogModel = blogFixture.getModel('blogId');
      const business: BusinessModel = businessFixture.getModel('bId');
      business.blogs.push(blog);
      const channelSet: ChannelSetModel = channelSetFixture.getModel('bId');

      sandbox
        .mock(channelService)
        .expects('findOneByType')
        .resolves();
      sandbox
        .mock(channelSetService)
        .expects('create')
        .resolves(channelSet);
      sandbox
        .mock(channelEventMessagesProducer)
        .expects('sendChannelSetNamedByApplication')
        .withArgs(channelSet, blogDTO.name)
        .resolves();
      sandbox
        .mock(blogModel)
        .expects('create')
        .resolves(blog);
      sandbox
        .mock(businessModel)
        .expects('findOneAndUpdate')
        .withArgs({ _id: business.id }, { $push: { blogs: blog } })
        .resolves();
      sandbox.stub(eventDispatcher, 'dispatch').resolves();
      sandbox.stub(blogAccessConfigModel, 'findOne').resolves();

      const result: BlogModel = await testService.create(business, blogDTO);

      expect(result).eq(blog);
      sandbox.verify();
    });
  });

  describe('removeInBusiness', (): void => {
    it('ok', async (): Promise<void> => {
      const blog: BlogModel = blogFixture.getModel('blogId');
      const business: BusinessModel = businessFixture.getModel('bId');
      business.blogs.push(blog);
      business.blogs.push(blogFixture.getModel('blogId2'));

      sandbox
        .mock(blogModel)
        .expects('remove')
        .withArgs({ _id: blog.id })
        .resolves();
      sandbox
        .mock(businessModel)
        .expects('update')
        .withArgs({ _id: business.id }, { $pull: { blogs: blog.id } })
        .resolves();
      sandbox
        .mock(eventDispatcher)
        .expects('dispatch')
        .withArgs(BlogEvent.BlogRemoved, blog)
        .resolves();

      await testService.removeInBusiness(business, blog);
      sandbox.verify();
    });

    it('cannot delete last blog', async (): Promise<void> => {
      const blog: BlogModel = blogFixture.getModel('blogId');
      const business: BusinessModel = businessFixture.getModel('bId');
      business.blogs.push(blog);

      sandbox.stub(blogModel, 'count').resolves(1)

      await expect(testService.removeInBusiness(business, blog)).to.be.eventually.rejectedWith(
        HttpException,
        'Can not delete the last blog',
      );
      sandbox.verify();
    });

    it('no blogs', async (): Promise<void> => {
      const blog: BlogModel = blogFixture.getModel('blogId');
      const business: BusinessModel = businessFixture.getModel('bId');

      sandbox.stub(blogModel, 'count').resolves(1)

      await expect(testService.removeInBusiness(business, blog)).to.be.eventually.rejectedWith(
        HttpException,
        'Can not delete the last blog',
      );
      sandbox.verify();
    });
  });

  describe('removeById', (): void => {
    it('ok', async (): Promise<void> => {
      const blog: BlogModel = blogFixture.getModel('blogId');

      sandbox
        .mock(eventDispatcher)
        .expects('dispatch')
        .withArgs(BlogEvent.BlogRemoved, blog)
        .resolves();
      sandbox
        .mock(blogModel)
        .expects('findOneAndDelete')
        .withArgs({ _id: blog.id })
        .resolves(blog);

      await testService.removeById(blog.id);
      sandbox.verify();
    });
  });

  describe('findAllByBusiness', (): void => {
    it('ok', async (): Promise<void> => {
      const blog: BlogModel = blogFixture.getModel('blogId');
      const business: BusinessModel = businessFixture.getModel('bId');
      business.blogs.push(blog);
      business.blogs.push(blogFixture.getModel('blogId2'));
      sandbox.stub(blogModel, 'find').resolves(business.blogs)

      const result: BlogModel[] = await testService.findAllByBusiness(business);
      sandbox.verify();
      expect(result).eq(business.blogs);
    });
  });

  describe('update', (): void => {
    it('ok', async (): Promise<void> => {
      const updateDto: UpdateBlogDto = blogFixture.getUpdateDTO();
      const business: BusinessModel = businessFixture.getModel('bId');
      const blog: BlogModel = blogFixture.getModel('blogId');
      const blogUpdated: BlogModel = blogFixture.getModel('blogIdU');
      blogUpdated.business = businessFixture.getModel('bId');

      sandbox
        .mock(blogModel)
        .expects('findOne')
        .withArgs({ _id: blog.id })
        .returns(blog);
      sandbox
        .mock(blogModel)
        .expects('findOneAndUpdate')
        .withArgs({ _id: blog.id }, { $set: updateDto }, { new: true })
        .resolves(blogUpdated);
      sandbox
        .mock(eventDispatcher)
        .expects('dispatch')
        .withArgs(BlogEvent.BlogUpdated, blog, blogUpdated)
        .resolves();

      const result: BlogModel = await testService.update(business, blog, updateDto);
      sandbox.verify();
      expect(result).to.be.eq(blogUpdated);
    });
  });

  describe('getList', (): void => {
    it('same title', async (): Promise<void> => {
      const query: string = 'aaaa';
      const limit: number = 5;
      const skip: number = 5;
      const blog: BlogModel = blogFixture.getModel('blogId');
      const mock: sinon.SinonMock = sandbox.mock(blogModel);
      mock
        .expects('find')
        .withArgs(query)
        .returns(
          {
            limit: sinon.stub().withArgs(limit).returnsThis(),
            populate: sinon.stub().returns([blog]),
            skip: sinon.stub().withArgs(skip).returnsThis(),
          },
        );

      const result: BlogModel[] = await testService.getList(query, limit, skip);

      sandbox.verify();
      expect(result).length(1);
      expect(result[0]).to.be.eq(blog);
    });
  });
});

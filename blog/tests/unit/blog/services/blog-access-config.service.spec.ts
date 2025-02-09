import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'mocha';
import * as mongoose from 'mongoose';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';
import 'sinon-mongoose';
import { BlogAccessConfigModel, BlogModel } from '../../../../src/blog/models';
import {
  BlogAccessConfigService,
} from '../../../../src/blog/services';
import { mongooseModelFixture } from '../../fixtures/mongooseModelFixture';
import { blogAccessConfigFixture } from '../../fixtures/blogAccessConfigFixture';
import { servicesFixture } from '../../fixtures/servicesFixture';
import { blogFixture } from '../../fixtures/blogFixture';
import { EventDispatcher } from '@pe/nest-kit';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

// tslint:disable-next-line:no-big-function
describe('BlogAccessConfigService', async (): Promise<void> => {
  let sandbox: sinon.SinonSandbox;

  let testService: BlogAccessConfigService;

  let blogAccessConfigModel: mongoose.Model<BlogAccessConfigModel>;
  let blogModel: mongoose.Model<BlogModel>;
  let eventDispatcher: EventDispatcher;
  
  before(
    async (): Promise<void> => {
      blogAccessConfigModel = mongooseModelFixture.getModelMock();
      blogModel = mongooseModelFixture.getModelMock();
      eventDispatcher = servicesFixture.getEventDispatcher();

      testService = new BlogAccessConfigService(blogAccessConfigModel, eventDispatcher);
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
      const blog: BlogModel = blogFixture.getModel("tId");
      
      const updateAccessConfigDTO: any = blogAccessConfigFixture.getUpdateAccessConfigDTO();
      const blogAccessConfig: BlogAccessConfigModel = blogAccessConfigFixture.getModel(
        'ctId',
        blog,
      );
      
      sandbox
        .mock(blogAccessConfigModel)
        .expects('create')
        .resolves(blogAccessConfig);
      
      const result: BlogAccessConfigModel = await testService.create(blog, updateAccessConfigDTO);

      expect(result).eq(blogAccessConfig);
      
      sandbox.verify();
    });
  });
  
  describe('findById', (): void => {
    it('ok', async (): Promise<void> => {
      const blog: BlogModel = blogFixture.getModel("tId");
      const blogAccessConfig: BlogAccessConfigModel = blogAccessConfigFixture.getModel(
        'ctId',
        blog,
      );

      sandbox
        .mock(blogAccessConfigModel)
        .expects('findOne')
        .withArgs({ _id: blogAccessConfig.id })
        .resolves(blogAccessConfig);
      
      const result: BlogAccessConfigModel = await testService.findById(blogAccessConfig.id);
      sandbox.verify();
      expect(result).eq(blogAccessConfig);
    });
  });

  describe('findByBlogId', (): void => {
    it('ok', async (): Promise<void> => {
      const blog: BlogModel = blogFixture.getModel("tId");
      const blogAccessConfig: BlogAccessConfigModel = blogAccessConfigFixture.getModel(
        'ctId',
        blog,
      );

      sandbox
        .mock(blogAccessConfigModel)
        .expects('findOne')
        .withArgs({ blog: blog })
        .resolves(blogAccessConfig);
      
      const result: BlogAccessConfigModel = await testService.findByBlog(blog);
      sandbox.verify();
      expect(result).eq(blogAccessConfig);
    });
  });
  
  describe('update', (): void => {
    it('ok', async (): Promise<void> => {
      const blog: BlogModel = blogFixture.getModel("tId");
      
      const updateAccessConfigDTO: any = blogAccessConfigFixture.getUpdateAccessConfigDTO();
      const blogAccessConfig: BlogAccessConfigModel = blogAccessConfigFixture.getModel(
        'ctId',
        blog,
      );
      
      sandbox
        .mock(blogAccessConfigModel)
        .expects('findOneAndUpdate')
        .resolves(blogAccessConfig);
      
      const result: BlogAccessConfigModel = await testService.update(blogAccessConfig, updateAccessConfigDTO);

      expect(result).eq(blogAccessConfig);
      
      sandbox.verify();
    });
  });
});

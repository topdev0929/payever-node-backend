import { EventDispatcher } from '@pe/nest-kit';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'mocha';
import mongoose from 'mongoose';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import 'sinon-mongoose';
import { BusinessModel } from '../../../../src/business';
import {
  BlogModel,
  BlogService,
} from '../../../../src/blog';
import {
  CommentModel,
  CreateCommentDto,
  CommentService, 
} from '../../../../src/comment';
import { CommentRabbitEventsProducer } from '../../../../src/comment/producers';
import { CommentEvent } from '../../../../src/comment/enums';
import { businessFixture } from '../../fixtures/businessFixture';
import { mongooseModelFixture } from '../../fixtures/mongooseModelFixture';
import { servicesFixture } from '../../fixtures/servicesFixture';
import { blogFixture } from '../../fixtures/blogFixture';
import { commentFixture } from '../../fixtures/commentFixture';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

// tslint:disable-next-line:no-big-function
describe('CommentService', async (): Promise<void> => {
  let sandbox: sinon.SinonSandbox;

  let testService: CommentService;

  let commentRabbitEventsProducer: CommentRabbitEventsProducer;
  let eventDispatcher: EventDispatcher;

  let blogService: BlogService;
  let commentModel: mongoose.Model<CommentModel>;

  before(
    async (): Promise<void> => {
      commentRabbitEventsProducer = servicesFixture.getCommentRabbitEventsProducer();
      eventDispatcher = servicesFixture.getEventDispatcher();

      blogService = servicesFixture.getBlogService();
      commentModel = mongooseModelFixture.getModelMock();

      testService = new CommentService(commentModel, blogService, commentRabbitEventsProducer, eventDispatcher);
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
      const commentDTO: CreateCommentDto = commentFixture.getCreateDTO();
      const blog: BlogModel = blogFixture.getModel('blogId');
      const business: BusinessModel = businessFixture.getModel('bId');
      const comment: CommentModel = commentFixture.getModel('cId', blog.id);

      sandbox
        .mock(commentModel)
        .expects('create')
        .resolves(comment);
      sandbox
        .mock(commentModel)
        .expects('count')
        .resolves(1);
      sandbox
        .mock(blogService)
        .expects('updateCommentsCount')
        .withArgs(business, blog, 1)
        .resolves();
      sandbox
        .mock(eventDispatcher)
        .expects('dispatch')
        .withArgs(CommentEvent.CommentCreated, comment)
        .resolves();

      const result: CommentModel = await testService.createComment(business, blog, commentDTO);

      expect(result).eq(comment);
      sandbox.verify();
    });
  });

  describe('findAllByBlog', (): void => {
    it('ok', async (): Promise<void> => {
      const blog: BlogModel = blogFixture.getModel('blogId');
      const comment: CommentModel = commentFixture.getModel('cId', blog.id);
      let commentsArray: CommentModel[] = [];
      commentsArray.push(comment);

      sandbox
        .mock(commentModel)
        .expects('find')
        .withArgs({ blog: blog.id })
        .resolves(commentsArray);

      const comments: CommentModel[] = await testService.findAllByBlog(blog);
      sandbox.verify();
      expect(comments).eq(commentsArray);
    });
  });
});

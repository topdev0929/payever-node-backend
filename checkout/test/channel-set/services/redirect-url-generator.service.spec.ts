import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import 'mocha';
import * as mongoose from 'mongoose';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import 'sinon-mongoose';
import { ParsedSlug } from '../../../src/channel-set/interfaces';
import { ChannelSetSlugModel } from '../../../src/channel-set/models';
import { RedirectUrlGenerator } from '../../../src/channel-set/services';
import { ChannelSetSlugSchema, ChannelSetSlugSchemaName } from '../../../src/mongoose-schema';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('RedirectUrlGenerator', async () => {
  let sandbox: sinon.SinonSandbox;

  let channelSetModel: ChannelSetSlugModel;

  let testService : (RedirectUrlGenerator);

  let channelSetModelMock : sinon.SinonMock;

  before(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedirectUrlGenerator,
        {
          provide: getModelToken(ChannelSetSlugSchemaName),
          useValue: mongoose.model(ChannelSetSlugSchemaName, ChannelSetSlugSchema),
        },
      ],
    }).compile();

    channelSetModel = module.get(getModelToken(ChannelSetSlugSchemaName));
    testService = module.get<RedirectUrlGenerator>(RedirectUrlGenerator);
});

  beforeEach(async () => {
    sandbox = sinon.createSandbox();

    channelSetModelMock =  sinon.mock(channelSetModel) as sinon.SinonMock;
  });

  afterEach(async () => {
    sandbox.restore();

    channelSetModelMock.restore();

    sandbox = undefined;
  });

  describe('generate', () => {
    it('checkout - ok', async () => {
      const slug ={
        type: 'checkout' ,
        slug: 'slugg',
      } as ParsedSlug;
      const query ='par:value';

      channelSetModelMock
        .expects('findOne')
        .withArgs({ slug: 'slugg' })
        .resolves({ save: (): void => {} });

      const result = await testService.generate(slug, query);

      expect(result).to.not.contain(query);
      expect(channelSetModelMock.verify());

    });

    it('finance - ok', async () => {
      const slug ={
        type: 'finance_express' ,
        slug: 'slugg'
      } as ParsedSlug;
      const query ='par:value';

      channelSetModelMock
        .expects('findOne')
        .never();

      const result = await testService.generate(slug, query );

      expect(channelSetModelMock.verify());
      expect(result).to.contain(slug.slug);
    });
  });

});

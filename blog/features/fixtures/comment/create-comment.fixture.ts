import { BaseFixture } from '@pe/cucumber-sdk/module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CommentModel } from '../../../src/comment/models';
import { CommentFactory } from '../factories';
import { CommentSchemaName } from '../../../src/mongoose-schema/mongoose-schema.names';

const ANOTHER_BUSINESS_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const DEFAULT_BLOG_ID: string = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

class CreateCommentDefaultExistsFixture extends BaseFixture {
  protected readonly commentModel: Model<CommentModel> = this.application.get(getModelToken(CommentSchemaName));

  public async apply(): Promise<void> {

    this.commentModel.create(CommentFactory.create({
        blog: DEFAULT_BLOG_ID as any,
        business: ANOTHER_BUSINESS_ID,
        content: "test",
    }) as any);
  }
}

export = CreateCommentDefaultExistsFixture;

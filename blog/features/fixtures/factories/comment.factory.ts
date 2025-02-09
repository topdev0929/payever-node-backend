import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';
import { Populable } from '../../../src/dev-kit-extras/population';
import { CommentModel } from '../../../src/comment/models';

const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory: any = (): Populable<CommentModel> => {
  seq.next();

  return ({
    _id: uuid.v4(),
    businessId: uuid.v4(),
    author: '',
    blog: '',
    content: '',
  }) as any;
};

export class CommentFactory {
  public static create: PartialFactory<Populable<CommentModel>> =
    partialFactory<Populable<CommentModel>>(defaultFactory);
}

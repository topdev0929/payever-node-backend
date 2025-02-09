import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';
import { Populable } from '../../../src/dev-kit-extras/population';
import { BlogModel } from '../../../src/blog/models';

const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory = (): Populable<BlogModel> => {
  seq.next();

  return ({
    _id: uuid.v4(),
    business: uuid.v4(),
    channelSet: uuid.v4(),
    isDefault: false,
    name: `Blog ${seq.current}`,
    picture: `image_${seq.current}`,
  }) as Populable<BlogModel>;
};

export class BlogFactory {
  public static create: PartialFactory<Populable<BlogModel>> = partialFactory<Populable<BlogModel>>(defaultFactory);
}

import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';
import { Populable } from '../../../src/dev-kit-extras/population';
import { BlogAccessConfigModel } from '../../../src/blog/models';

const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory: any = (): Populable<BlogAccessConfigModel> => {
  seq.next();

  return ({
    _id: uuid.v4(),
    blog: '',
    isLive: false,
    internalDomain: '',
    internalDomainPattern: '',
    ownDomain: '',
    isPrivate: false,
    privateMessage: '',
    privatePassword: '',
    isLocked: false,
  }) as Populable<BlogAccessConfigModel>;
};

export class BlogAccessConfigFactory {
  public static create: PartialFactory<Populable<BlogAccessConfigModel>> =
    partialFactory<Populable<BlogAccessConfigModel>>(defaultFactory);
}

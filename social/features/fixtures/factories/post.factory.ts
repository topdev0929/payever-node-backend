import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';
import { PostTypeEnum, PoststatusEnum } from '../../../src/social/enums';

const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory: any = (): any => {
  seq.next();

  return ({
    _id: uuid.v4(),
    content: `content_${seq.current}`,
    media: `media_${seq.current}`,
    postedAt: new Date(),
    status: PoststatusEnum.PostNow,
    title: `title_${seq.current}`,
    type: PostTypeEnum.Post,
  });
};

export class PostFactory {
  public static create: PartialFactory<any> = partialFactory<any>(defaultFactory);
}

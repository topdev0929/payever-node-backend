import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';

const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory: any = (): any => {
  seq.next();

  return ({
    _id: uuid.v4(),
    channelSets: [],
    isDefalt: false,
    name: `theme_${seq.current}`,
    picture: null,
    publishedId: null,
    source: null,
    type: null,
    versionsIds: [],
  });
};

export class ThemeFactory {
  public static create: PartialFactory<any> = partialFactory<any>(defaultFactory);
}

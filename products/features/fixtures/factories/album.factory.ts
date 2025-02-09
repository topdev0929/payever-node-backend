import * as uuid from 'uuid';
import { partialFactory, SequenceGenerator } from '@pe/cucumber-sdk';

const seq: SequenceGenerator = new SequenceGenerator();

export const defaultAlbumFactory: any = (): any => {
  seq.next();

  return ({
    ancestors: [],
    businessId: uuid.v4(),
    description: `Description ${seq.current}`,
    icon: String,
    name: `Album ${seq.current}`,
    parent: null,
  });
};

export const albumFactory: any = partialFactory(defaultAlbumFactory);

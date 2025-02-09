import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';

import { Populable } from '../../../src/dev-kit-extras/population';
import { DomainModel} from '../../../src/blog/models';

const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory: any = (): any => {
  seq.next();

  return ({
    id: uuid.v4(),
    isConnected: false,
    name: `domain.${seq.current}`,
    blogId: uuid.v4(),
  });
};

export class DomainFactory {
  public static create: PartialFactory<Populable<DomainModel>> =
    partialFactory<Populable<DomainModel>>(defaultFactory);
}

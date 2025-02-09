import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';
import { SiteAccessConfigDocument } from '../../../src/sites/schemas';

const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory: any = (): any => {
  seq.next();

  return ({
    _id: uuid.v4(),
    site: '',
    isLive: false,
    internalDomain: '',
    internalDomainPattern: '',
    ownDomain: '',
    isPrivate: false,
    privateMessage: '',
    privatePassword: '',
    isLocked: false,
  });
};

export class SiteAccessConfigFactory {
  public static create: PartialFactory<SiteAccessConfigDocument> = partialFactory<SiteAccessConfigDocument>(defaultFactory);
}

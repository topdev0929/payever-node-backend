import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';

const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory: any = (): any => {
  seq.next();

  return ({
    _id: uuid.v4(),
    businessId: `business_${seq.current}`,
    isLive: false,

    internalDomain: `internameDomain_${seq.current}`,
    internalDomainPattern: `pattern_${seq.current}`,
    isPrivate: false,
    ownDomain: `owmDomain_${seq.current}`,
    privateMessage: `message_${seq.current}`,
    privatePassword: `password_${seq.current}`,
    socialImage: `socialImage_${seq.current}`,

    isLocked: false,
    version: `version_${seq.current}`,
  });
};

export class AccessConfigFactory {
  public static create: PartialFactory<any> = partialFactory<any>(defaultFactory);
}

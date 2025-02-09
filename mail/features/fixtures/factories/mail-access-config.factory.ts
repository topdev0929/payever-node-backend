import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';
import { MailAccessConfigModel } from '../../../src/modules/mail/models';

const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory: any = (): MailAccessConfigModel => {
  seq.next();

  return ({
    _id: uuid.v4(),
    internalDomain: '',
    internalDomainPattern: '',
    isLive: false,
  }) as MailAccessConfigModel;
};

export class MailAccessConfigFactory {
  public static create: PartialFactory<MailAccessConfigModel> =
    partialFactory<MailAccessConfigModel>(defaultFactory);
}


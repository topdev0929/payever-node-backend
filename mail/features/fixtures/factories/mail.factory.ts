import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';
import { MailModel } from '../../../src/modules/mail/models';

const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory: any = (): MailModel => {
  seq.next();

  return ({
    _id: uuid.v4(),
    businessId: uuid.v4(),
    name: `Shop ${seq.current}`,
  }) as MailModel;
};

export class MailFactory {
  public static create: PartialFactory<MailModel> = partialFactory<MailModel>(defaultFactory);
}

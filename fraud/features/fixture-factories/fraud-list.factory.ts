import { DefaultFactory, PartialFactory, partialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';
import { FraudListInterface } from '../../src/fraud/interfaces';
import { ListTypeEnum } from '../../src/fraud/enums';

const seq: SequenceGenerator = new SequenceGenerator(1);

type FraudListType = FraudListInterface & { _id: string };

const LocalFactory: DefaultFactory<FraudListType> = (): FraudListType => {
  seq.next();

  return {
    _id: uuid.v4(),
    name: `List`,
    type: ListTypeEnum.email,
    values: [
      'test@.email.com',
    ],
  };
};

export class FraudListFactory {
  public static create: PartialFactory<FraudListType> = partialFactory<FraudListType>(LocalFactory);
}

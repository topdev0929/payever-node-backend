import { DefaultFactory, PartialFactory, partialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';
import { FraudRuleInterface } from '../../src/fraud/interfaces';
import { RuleTypeEnum, RuleOperatorEnum, RuleActionEnum } from '../../src/fraud/enums';

const seq: SequenceGenerator = new SequenceGenerator(1);

type FraudRuleType = FraudRuleInterface & { _id: string };

const LocalFactory: DefaultFactory<FraudRuleType> = (): FraudRuleType => {
  seq.next();

  return {
    _id: uuid.v4(),
    name: `High Value Transaction`,
    conditions: [
      {
        type: RuleTypeEnum.amount,
        operator: RuleOperatorEnum.greaterThan,
        value: 100000
      }
    ],
    actions: [
      {
        type: RuleActionEnum.block,
      }
    ]
  };
};

export class FraudRuleFactory {
  public static create: PartialFactory<FraudRuleType> = partialFactory<FraudRuleType>(LocalFactory);
}

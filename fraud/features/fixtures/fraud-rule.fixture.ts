/* eslint-disable-object-literal-sort-keys */
import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { FraudRuleFactory } from '../fixture-factories';
import { FraudRuleSchemaName } from '../../src/fraud/schemas';
import { FraudRuleModel } from '../../src/fraud/models';
import { RuleTypeEnum, RuleOperatorEnum, RuleActionEnum } from '../../src/fraud/enums';
import { RuleTimeUnitEnum } from '../../src/fraud/enums/rule-time-unit.enum';

class TestFixture extends BaseFixture {
  private FraudRuleModel: Model<FraudRuleModel> = this.application.get(getModelToken(FraudRuleSchemaName));

  public async apply(): Promise<void> {
    const fraudRuleId: string = 'a21a17d4-18b6-486f-87c4-328d62b4f728';
    const fraudRuleId2: string = 'd1812473-68e3-42e4-a6bb-6d462559eae6';
    const businessId: string = '02c50fb6-3fbe-4941-81bc-f3ecceed9ced';

    const FraudRule: FraudRuleModel = await this.FraudRuleModel.create(FraudRuleFactory.create({
      _id: fraudRuleId,
      name: `High Value Transaction`,
      businessId: businessId,
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
    }) as any);

    await FraudRule.save();

    const FraudRule2: FraudRuleModel = await this.FraudRuleModel.create(FraudRuleFactory.create({
      _id: fraudRuleId2,
      name: `High Value Transaction`,
      businessId: businessId,
      conditions: [
        {
          type: RuleTypeEnum.velocity,
          field: 'email',
          operator: RuleOperatorEnum.greaterThan,
          value: 5,
          timeUnit: RuleTimeUnitEnum.days,
        }
      ],
      actions: [
        {
          type: RuleActionEnum.review,
          value: 'manualReview',
        }
      ]
    }) as any);

    await FraudRule2.save();
  }
}

export = TestFixture;

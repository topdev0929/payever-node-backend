import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';

import { BankAccountInterface, BusinessInterface, Template } from '../../src/mailer/interfaces';
import { BusinessSchemaName, BankAccountSchemaName } from '../../src/mailer/schemas';

class BankAccountsFixture extends BaseFixture {
  private readonly model: Model<BankAccountInterface> = this.application.get(getModelToken(BankAccountSchemaName));

  public async apply(): Promise<void> {
    await this.model.create(
      {
        _id: 'cb8f5638-56a8-428c-8448-9324460450d2',
        accountNumber: '0514297220',
        bankCode: '10070848',
        bic: 'DEUTDEDB110',
        business_id: '614cb154-0323-4df0-be89-85376b9de666',
        city: 'Berlin',
        country: 'DE',
        iban: 'DE60100708480514297100',
        owner: 'arst',
        swift: '10120848',
      },
      {
        _id: 'ab93513c-745a-4dfe-b2ed-4cc57f637d26',
        accountNumber: '0514297220',
        bankCode: '10070848',
        bic: 'DEUTDEDB110',
        business_id: '3bc2d7f7-cea6-4986-9b46-26a3011225a7',
        city: 'Berlin',
        country: 'DE',
        owner: 'arst',
        swift: '10120848',
      },
      {
        _id: '74fbbbc2-621d-4c9c-b15c-b826201dbbc6',
        bankCode: '10070848',
        bic: 'DEUTDEDB110',
        business_id: '46fd0097-0b6e-46ba-8272-2f0770fc4c14',
        city: 'Berlin',
        country: 'DE',
        owner: 'arst',
        swift: '10120848',
      },
    );
  }
}

export = BankAccountsFixture;

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BankAccountInterface } from '../interfaces';
import { BusinessDto } from '@pe/business-kit';
import { BankAccountSchemaName } from '../schemas';

@Injectable()
export class BankAccountService {

  constructor(
    @InjectModel(BankAccountSchemaName) private readonly bankAccountModel: Model<BankAccountInterface>,
  ) { }

  public async deleteAllByBusinessId(businessId: string): Promise<void> {
    await this.bankAccountModel.deleteMany({ business_id: businessId }).exec();
  }

  public async upsertBankAccount(business: BusinessDto): Promise<void> {
    await this.bankAccountModel.updateOne(
      { _id: business._id },
      {
        $set: {
          accountNumber: business?.bankAccount?.accountNumber,
          bankCode: business?.bankAccount?.bankCode,
          bankName: business?.bankAccount?.bankName,
          bic: business?.bankAccount?.bic,
          business_id: business._id,
          city: business?.bankAccount?.city,
          country: business?.bankAccount?.country,
          iban: business?.bankAccount?.iban,
          owner: business?.bankAccount?.owner,
          routingNumber: business?.bankAccount?.routingNumber,
          swift: business?.bankAccount?.swift,
        },
      }, { upsert: true });
  }
}

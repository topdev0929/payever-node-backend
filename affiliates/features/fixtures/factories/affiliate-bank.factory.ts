import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';

const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory: any = (): any => {
  seq.next();

  return ({
    _id: uuid.v4(),
    accountHolder: `account_holder_${seq.current}`,
    accountNumber: `account_number_${seq.current}`, 
    bankName: `bank_name_${seq.current}`, 
    city: `city_${seq.current}`,  
    country: `country_${seq.current}`,
  });
};

export class AffiliateBankFactory {
  public static create: PartialFactory<any> = partialFactory<any>(defaultFactory);
}

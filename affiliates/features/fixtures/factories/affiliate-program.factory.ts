import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import { CommissionTypeEnum, AffiliateStatusEnum } from '../../../src/affiliates/enums';
import * as uuid from 'uuid';

const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory: any = (): any => {
  seq.next();

  return ({
    _id: uuid.v4(),
    assets: 0,
    clicks: 0,
    commissionType: CommissionTypeEnum.Percentage,
    cookie: new Date(),
    currency: 'USD',
    name: `name_${seq.current}`,
    programApi: `api_${seq.current}`,
    startedAt: new Date(),
    status: AffiliateStatusEnum.ACTIVE,
    url: `url_${seq.current}.com`,
  });
};

export class AffiliateProgramFactory {
  public static create: PartialFactory<any> = partialFactory<any>(defaultFactory);
}

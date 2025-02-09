import * as uuid from 'uuid';
import { partialFactory, uniqueString, SequenceGenerator, PartialFactory } from '@pe/cucumber-sdk';
import { MarketplaceInterface } from '../../../src/marketplace/interfaces';
import { MarketplaceTypeEnum } from '../../../src/marketplace';

const seq: SequenceGenerator = new SequenceGenerator(1);
const defaultMarketplaceFactory: () => MarketplaceInterface = (): MarketplaceInterface => {
  seq.next();

  return {
    businessId: uuid.v4(),
    name: 'my shop',
    type: MarketplaceTypeEnum.SHOP,
  };
};

export const marketplaceFactory: PartialFactory<MarketplaceInterface> = partialFactory(defaultMarketplaceFactory);

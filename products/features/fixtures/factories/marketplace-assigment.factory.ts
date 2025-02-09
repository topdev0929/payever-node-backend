import * as uuid from 'uuid';
import { partialFactory, uniqueString, SequenceGenerator, PartialFactory } from '@pe/cucumber-sdk';
import { MarketplaceAssigmentInterface } from '../../../src/marketplace/interfaces';

const seq: SequenceGenerator = new SequenceGenerator(1);
const defaultMarketplaceAssigmentFactory: () => MarketplaceAssigmentInterface = (): MarketplaceAssigmentInterface => {
  seq.next();

  return {
    marketplaceId: uuid.v4(),
    productUuid: uuid.v4(),
  };
};

export const marketplaceAssigmentFactory: PartialFactory<MarketplaceAssigmentInterface> = partialFactory(
  defaultMarketplaceAssigmentFactory,
);

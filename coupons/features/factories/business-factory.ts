import { partialFactory, PartialFactory } from '@pe/cucumber-sdk';
import { BusinessInterface } from '@pe/business-kit';

const defaultFactory: () => any = () => {
    return { };
};

export const businessFactory: PartialFactory<BusinessInterface> = partialFactory(defaultFactory);

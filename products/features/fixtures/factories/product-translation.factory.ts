import * as uuid from 'uuid';
import { partialFactory } from '@pe/cucumber-sdk';

const productTranslationDefaultFactory: any = () => {
  return {
    _id: uuid.v4(),
    product: uuid.v4(),
    translations: {
      DE: {
        description: 'Lorem ipsum dolor sit amet Deutsch',
        images: [
          'de.png',
        ],
        imagesUrl: [
          'https://payevertesting.blob.core.windows.net/products/de.png',
        ],
        title: 'Test product Deutsch',
      },
      EN: {
        description: 'Lorem ipsum dolor sit amet En',
        images: [
          'en.png',
        ],
        imagesUrl: [
          'https://payevertesting.blob.core.windows.net/products/en.png',
        ],
        title: 'Test product En',
      },
    },
  };
};

export const productTranslationFactory: any = partialFactory(productTranslationDefaultFactory);

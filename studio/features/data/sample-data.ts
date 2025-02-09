import * as uuid from 'uuid';
import { SampleUserMediaDto } from '../../src/sample-data/dto';
import { MediaTypeEnum } from '../../src/studio/enums';

const SAMPLE_MEDIAS: SampleUserMediaDto[] = [
  {
    '_id': uuid.v4(),
    'mediaType': MediaTypeEnum.IMAGE,
    'name': 'Sample media 1',
    'url': 'https://payeverproduction.blob.core.windows.net/' +
      'products/6227b1be-dfad-40f8-9c0e-d80224928612-orange.jpg',
  },
  {
    '_id': uuid.v4(),
    'mediaType': MediaTypeEnum.IMAGE,
    'name': 'Sample media 2',
    'url': 'https://payeverproduction.blob.core.windows.net/' +
      'products/d475f8a1-378d-4b9f-84cb-e436a570aa7c-watermelon.jpg',
  },
];

export {
  SAMPLE_MEDIAS,
};

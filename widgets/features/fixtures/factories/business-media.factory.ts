import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';
import { BusinessMediaModel } from '../../../src/apps/studio-app/models';

const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory: any = (): any => {
  seq.next();

  return ({
    _id: uuid.v4(),
    businessId: uuid.v4(),
    mediaType: 'image',
    name: `test_media_${seq.current}`,
    url: `http://media-url-${seq.current}.com`,
  });
};

export class BusinessMediaFactory {
  public static create: PartialFactory<BusinessMediaModel>
    = partialFactory<BusinessMediaModel>(defaultFactory);
}

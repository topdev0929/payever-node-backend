import { 
  partialFactory, 
  SequenceGenerator, 
  uniqueString, 
  PartialFactory, 
  DefaultFactory,
} from '@pe/cucumber-sdk';
import { v4 } from 'uuid';

const seq: SequenceGenerator = new SequenceGenerator(0, 1, new Date('2019-06-25T06:00:00.000Z'));

export const productDefaultFactory: DefaultFactory<any> = () : any => {
  seq.next();

  return ({
    _ud: v4(),
    businessUuid: v4(),
    id: v4(),
    lastSell: seq.currentDate,
    name: `Product ${seq.current}`,
    quantity: 10,
    thumbnail: uniqueString(),
    uuid: v4(),
  });
};

export const productFactory: PartialFactory<any> = partialFactory<any>(productDefaultFactory);

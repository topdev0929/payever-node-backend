import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';

const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory: any = (): any => {
  seq.next();

  return ({
    _id: uuid.v4(),
    isConnected: false,
    name: `name_${seq.current}`,
    appointmentNetwork: `sub_${seq.current}`,
  });
};

export class DomainFactory {
  public static create: PartialFactory<any> = partialFactory<any>(defaultFactory);
}

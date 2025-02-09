import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';

const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory: any = (): any => {
  seq.next();

  return ({
    _id: uuid.v4(),
    favicon: `favicon_${seq.current}`,
    logo: `logo_${seq.current}`,
    name: `name_${seq.current}`,
  });
};

export class AppointmentNetworkFactory {
  public static create: PartialFactory<any> = partialFactory<any>(defaultFactory);
}

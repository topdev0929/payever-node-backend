import { DefaultFactory, PartialFactory, partialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';
import { ConnectionInterface } from '../../src/connection/interfaces';

const seq: SequenceGenerator = new SequenceGenerator(1);

type ConnectionType = ConnectionInterface & { _id: string };

const LocalFactory: DefaultFactory<ConnectionType> = (): ConnectionType => {
  seq.next();

  return {
    _id: uuid.v4(),
    name: `Connection ${seq.current}`,
  };
};

export class ConnectionFactory {
  public static create: PartialFactory<ConnectionType> = partialFactory<ConnectionType>(LocalFactory);
}

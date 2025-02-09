import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';

const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory: any = (): any => {
  seq.next();

  return ({
    _id: uuid.v4(),
    app: `test_app_${seq.current}`,
    data: { },
    entity: uuid.v4(),
    hash: seq.current,
    kind: `kind_${seq.current}`,
    message: `message_${seq.current}`,
  });
};

export class NotificationFactory {
  public static create: PartialFactory<any> = partialFactory<any>(defaultFactory);
}

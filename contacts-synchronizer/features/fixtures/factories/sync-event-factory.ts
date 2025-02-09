import * as uuid from 'uuid';

import { SequenceGenerator, partialFactory } from '@pe/cucumber-sdk';

import { randomFromList } from './helpers';

const success = randomFromList([true, false]);

export const syncEventDefaultFactory = (seq: SequenceGenerator) => () => {
  seq.next();

  return {
    _id: uuid.v4(),
    message: `some log message ${seq.current}`,
    date: seq.currentDate,
    success: success(),
    itemId: uuid.v4(),
  };
};

export const syncEventFactory = partialFactory(syncEventDefaultFactory(new SequenceGenerator()));

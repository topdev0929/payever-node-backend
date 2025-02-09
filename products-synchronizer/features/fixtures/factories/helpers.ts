import { SequenceGenerator } from '@pe/cucumber-sdk';

export function randomFromList<T>(list: T[]): () => T {
  return () => list[Math.random() % list.length];
};

export const incrementAndGetSeq = (seq: SequenceGenerator) => {
  seq.next();

  return seq.current;
};

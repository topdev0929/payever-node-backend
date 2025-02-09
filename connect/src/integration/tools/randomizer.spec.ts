import { Randomizer } from './randomizer';
import { expect } from 'chai';

describe('Randomizer', () => {
  it('shuffleArray', () => {
    const arr = [1, 2, 3];

    for (let i = 0; i < 10; i++) {
      const r = Randomizer.shuffleArray(arr);
      expect(r.length).to.equal(arr.length);
      expect(r).to.contain(arr[0]);
      expect(r).to.contain(arr[1]);
      expect(r).to.contain(arr[2]);
    }
  });

  it('randomInt', () => {
    for (let i = 0; i < 10; i++) {
      const r = Randomizer.randomInt(0, 2);
      expect([0, 1, 2]).to.contain(r);
    }
  });
});

import { expect } from 'chai';
import { AppSchema } from './apps.schema';

describe('AppSchema', async () => {
  it('should contain unique index: {code, version}', () => {
    const hasIndex: boolean = AppSchema.indexes().some((x: any) => x[0].code && x[0].version && x[1].unique);
    expect(hasIndex).to.be.true;
  });
});

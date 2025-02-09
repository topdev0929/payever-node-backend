import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import 'mocha';
import * as sinonChai from 'sinon-chai';
import { MappingHelper } from '../../../../src/social/helpers';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('Post mapping for ES', () => {
  before(() => { });
  beforeEach(() => { });

  describe('calculate sortDate field ', () => {
    const createTime = new Date('2021-01-01');
    const updateTime = new Date('2021-01-02');
    const postTime = new Date('2021-01-03');
    const scheduleTime = new Date('2021-01-04');

    it('sortDate for posted', async () => {
      const res: any = await MappingHelper.map({
        status: 'postnow',
        postedAt: postTime,
        toBePostedAt: scheduleTime,
        createdAt: createTime,
        updatedAt: updateTime,
      } as any, {} as any, false);
      expect(res.sortDate).to.equal(postTime);
    });


    it('sortDate for scheduled', async () => {
      const res: any = await MappingHelper.map({
        status: 'schedule',
        postedAt: postTime,
        toBePostedAt: scheduleTime,
        createdAt: createTime,
        updatedAt: updateTime,
      } as any, {} as any, false);
      expect(res.sortDate).to.equal(scheduleTime);
    });


    it('sortDate for draft', async () => {
      const res: any = await MappingHelper.map({
        status: 'draft',
        postedAt: postTime,
        toBePostedAt: scheduleTime,
        createdAt: createTime,
        updatedAt: updateTime,
      } as any, {} as any, false);
      expect(res.sortDate).to.equal(scheduleTime);

      const res2: any = await MappingHelper.map({
        status: 'draft',
        postedAt: postTime,
        toBePostedAt: null,
        createdAt: createTime,
        updatedAt: null,
      } as any, {} as any, false);
      expect(res2.sortDate).to.equal(createTime);

      const res3: any = await MappingHelper.map({
        status: 'draft',
        postedAt: postTime,
        toBePostedAt: null,
        createdAt: createTime,
        updatedAt: updateTime,
      } as any, {} as any, false);
      expect(res3.sortDate).to.equal(updateTime);
    });
  });
});

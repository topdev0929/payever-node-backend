import 'mocha';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinonChai from 'sinon-chai';
import { PaginationHelper } from '../../../../src/studio/helpers';
import { BuilderPaginationDto } from '../../../../src/studio/dto';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('PaginationHelper', () => {
  describe('getPagination()', () => {
    it('should convert PaginationDto to pagination for mongoose', () => {
      expect(
        PaginationHelper.getPagination(new BuilderPaginationDto()),
      ).to.deep.equal({
        limit: 10,
        skip: 0,
      });
    });

    it('should convert custom PaginationDto to pagination for mongoose', () => {
      const dto = new BuilderPaginationDto();
      dto.page = '3';
      dto.limit = '4';
      expect(
        PaginationHelper.getPagination(dto),
      ).to.deep.equal({
        limit: 4,
        skip: 8,
      });
    });
  });

  describe('getSortQuery()', () => {
    it('should convert PaginationDto to sort object', async () => {
      expect(
        PaginationHelper.getSortQuery(new BuilderPaginationDto()),
      ).to.deep.equal({
        updatedAt: -1,
      });
    });

    it('should convert PaginationDto with sorts to sort object', async () => {
      const dto: BuilderPaginationDto = {
        asc: ['name'],
        desc: ['id'],
      } as any;

      expect(
        PaginationHelper.getSortQuery(dto),
      ).to.deep.equal({
        id: -1,
        name: 1,
      });
    });

    it('should convert PaginationDto with defaultSort to sort object', async () => {
      expect(
        PaginationHelper.getSortQuery(new BuilderPaginationDto(), { createdAt: 1 }),
      ).to.deep.equal({
        createdAt: 1
      });
    });
  });
});

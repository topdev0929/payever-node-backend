import 'mocha';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinonChai from 'sinon-chai';
import { UserRoleHelper } from '../../../../src/studio/helpers';
import { RolesEnum } from '@pe/nest-kit';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('UserRoleHelper', () => {
  describe('getPagination()', () => {
    it('should return true for user having admin role', () => {
      expect(
        UserRoleHelper.isAdmin([
          { name: RolesEnum.admin },
          { name: RolesEnum.merchant },
        ]),
      ).to.equal(true);
    });

    it('should return false for user who does not have admin role', () => {
      expect(
        UserRoleHelper.isAdmin([
          { name: RolesEnum.merchant },
        ]),
      ).to.equal(false);
    });
  });
});

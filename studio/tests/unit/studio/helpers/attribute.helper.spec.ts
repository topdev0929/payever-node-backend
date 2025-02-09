import 'mocha';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinonChai from 'sinon-chai';
import { AttributeHelper } from '../../../../src/studio/helpers';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('AttributeHelper', () => {
  describe('mergeUserAttributes()', () => {
    it('should merge user attributes with no common value', () => {
      expect(
        AttributeHelper.mergeUserAttributes(
          [
            { attribute: 'test1', value: 'test1' },
          ],
          []
        ),
      ).to.deep.equal([
        { attribute: 'test1', value: 'test1' },
      ]);
    });

    it('should merge user attributes with common values (not equal to previous value)', () => {
      expect(
        AttributeHelper.mergeUserAttributes(
          [
            { attribute: 'test1', value: 'test1' },
          ],
          [
            { attribute: 'test1', value: 'new' },
          ]
        ),
      ).to.not.deep.equal([
        { attribute: 'test1', value: 'test1' },
      ]);
    });

    it('should merge user attributes with common values', () => {
      expect(
        AttributeHelper.mergeUserAttributes(
          [
            { attribute: 'test1', value: 'test1' },
          ],
          [
            { attribute: 'test1', value: 'new' },
          ]
        ),
      ).to.deep.equal([
        { attribute: 'test1', value: 'new' },
      ]);
    });
  });

  describe('filterNotNullUserAttributes()', () => {
    it('should filter objects with invalid attribute value', () => {
      expect(
        AttributeHelper.filterNotNullUserAttributes(
          {
            userAttributes: [
              { attribute: 'test1', value: 'test1' },
            ],
          }
        ),
      ).to.deep.equal({
        userAttributes: [
          { attribute: 'test1', value: 'test1' },
        ],
      });
    });

    it('should filter objects with invalid attribute value (has invalid values)', () => {
      expect(
        AttributeHelper.filterNotNullUserAttributes(
          {
            userAttributes: [
              { attribute: 'test1', value: 'test1' },
              { attribute: null, value: 'test2' },
              { attribute: undefined, value: 'test3' },
              { attribute: '', value: 'test4' },
            ],
          }
        ),
      ).to.deep.equal({
        userAttributes: [
          { attribute: 'test1', value: 'test1' },
        ],
      });
    });
  });

  describe('filterUserAttribute()', () => {
    it('should merge user attributes with no common value', () => {
      expect(
        AttributeHelper.filterUserAttribute(
          {
            attributes: [
              { attribute: 'test1', value: 'test1' },
            ],
          }
        ),
      ).to.deep.equal([
        {
          '$and': [
            { 'userAttributes.attribute': 'test1' },
            { 'userAttributes.value': 'test1' },
          ],
        },
      ]);
    });
  });
});

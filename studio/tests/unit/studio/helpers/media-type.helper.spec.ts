import 'mocha';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinonChai from 'sinon-chai';
import { MediaTypeHelper } from '../../../../src/studio/helpers';
import { MediaTypeEnum } from '../../../../src/studio/enums';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('MediaTypeHelper', () => {
  describe('getMediaType()', () => {
    it('should return image for image media types', () => {
      expect(
        MediaTypeHelper.getMediaType('png'),
      ).to.equal(MediaTypeEnum.IMAGE);
    });

    it('should return video for video media types', () => {
      expect(
        MediaTypeHelper.getMediaType('mov'),
      ).to.equal(MediaTypeEnum.VIDEO);
    });

    it('should return undefined for invalid media types', () => {
      expect(
        MediaTypeHelper.getMediaType('invalid'),
      ).to.equal(undefined);
    });
  });
});

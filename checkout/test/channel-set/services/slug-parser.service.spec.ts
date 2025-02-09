import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import 'mocha';
import * as sinonChai from 'sinon-chai';
import 'sinon-mongoose';
import { SlugParser } from '.';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('SlugParser', async () => {

  before(async () => {
  });

  beforeEach(async () => {
  });

  afterEach(async () => {
  });

  describe('parse', () => {
    it('slug is shipping', async () => {
      const result = SlugParser.parse('asdasd/shipping');
      expect(result.type).to.be.eq('checkout');
      expect(result.slug).to.be.eq('asdasd');
    });

    it('slug is checkout', async () => {
      const slug = 'asdasd/shipping/asdasd';
      const result = SlugParser.parse(slug);
      expect(result.type).to.be.eq('checkout');
      expect(result.slug).to.be.eq(slug);
    });

    it('slug is finance', async () => {
      const slug = '12312/qweqwe';
      const result = SlugParser.parse(slug);
      expect(result.type).to.be.eq('finance_express');
      expect(result.slug).to.be.eq(slug);
    });

    it('slug hasn't been parsed', async () => {
      const slug = 'asdasd/asddaa/asdasd/asdasd';

      expect(function(){
        SlugParser.parse(slug)
      }
      ).to.throw(
        Error,
        `Unable to parse checkout slug ${slug}`
      );
    });

    });
  });

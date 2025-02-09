
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import 'mocha';
import * as sinonChai from 'sinon-chai';
import { DomPurifyTools } from '../../src/tools';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('dom purify helper test', () => {
  describe('dom purify samples', () => {
    it('should sanitize xss', async () => {
      const samples: { input: string, sanitized: string }[] = [
        {
          input: '<img src=x onerror=alert(1)//>',
          sanitized: '<img src="x">',
        },
        {
          input: '<svg><g/onload=alert(2)//<p>',
          sanitized: '<svg><g></g></svg>',
        },
        {
          input: '<p>abc<iframe//src=jAva&Tab;script:alert(3)>def</p>',
          sanitized: '<p>abc</p>',
        },
        {
          input: '<math><mi//xlink:href="data:x,<script>alert(4)</script>">',
          sanitized: '<math><mi></mi></math>',
        },
        {
          input: '<TABLE><tr><td>HELLO</tr></TABL>',
          sanitized: '<table><tbody><tr><td>HELLO</td></tr></tbody></table>',
        },
        {
          input: '<UL><li><A HREF=//google.com>click</UL>',
          sanitized: '<ul><li><a href="//google.com">click</a></li></ul>',
        },
        {
          input:'<a href="http://link">ok</a>',
          sanitized:'<a href="http://link">ok</a>',
        }
      ];
      samples.forEach(item => {
        expect(DomPurifyTools.sanitize(item.input)).to.equal(item.sanitized);
      })
    });
  });
});

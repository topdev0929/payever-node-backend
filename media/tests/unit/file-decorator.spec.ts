
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import 'mocha';
import * as sinonChai from 'sinon-chai';
import * as fs from 'fs';
import * as path from 'path';
import { getMimeTypeByContent } from '../../src/http/decorators/files.decorator';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

const samplesDir: string = path.join(__dirname, 'files');

describe('File decorator ', () => {

  it('should detect mime type by file content', async () => {
    const checkList = [
      { fileName: 'sample.svg', defaultMimeType: 'svg', expected: { ext: 'svg', mime: 'image/svg+xml' } },
      { fileName: 'sample.svg.txt', defaultMimeType: 'text/plain', expected: { ext: 'svg', mime: 'image/svg+xml' } },
      { fileName: 'sample.html', defaultMimeType: 'text/html', expected: { ext: 'html', mime: 'text/html' } },
      { fileName: 'sample.html.txt', defaultMimeType: 'text/plain', expected: { ext: 'html', mime: 'text/html' } },
      { fileName: 'sample.html.csv', defaultMimeType: 'text/csv', expected: { ext: 'csv', mime: 'text/csv' } },
    ];

    for (const item of checkList) {
      const file = await fs.readFileSync(path.join(samplesDir, item.fileName));
      const mimeType = await getMimeTypeByContent(file, item.fileName, item.defaultMimeType);
      expect(mimeType).to.eql(item.expected);
    }
  });
});

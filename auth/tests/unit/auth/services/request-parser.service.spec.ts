import * as chai from 'chai';
import 'mocha';
import * as sinon from 'sinon';
import { FastifyRequestWithIpInterface } from '../../../../src/auth/interfaces';
import { RequestParser } from '../../../../src/auth/services/request-parser.service';

const expect: Chai.ExpectStatic = chai.expect;

describe('Testing request parser service', () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
  });

  afterEach(async () => {
    await sandbox.restore();
    sandbox = undefined;
  });

  describe('Testing parse ip address feature', async () => {
    const testingCases: any = [
      {
        description: 'localhost case',
        expectedIpAddress: '127.0.0.1',
        expectedIpSubnet: '127.0.0.0',
        ip: '127.0.0.1',
      },
      {
        description: 'localhost as ipv6 case',
        expectedIpAddress: '127.0.0.1',
        expectedIpSubnet: '127.0.0.0',
        ip: '::ffff:127.0.0.1',
      },
      {
        description: 'ipv6 localhost',
        expectedIpAddress: '::1',
        expectedIpSubnet: '::',
        ip: '::1',
      },
      {
        description: 'ipv6 address',
        expectedIpAddress: 'fdb0:eb16:d21b:78d8:ffff:ffff:ffff:ffff',
        expectedIpSubnet: 'fdb0:eb16:d21b:78d8::',
        ip: 'fdb0:eb16:d21b:78d8:ffff:ffff:ffff:ffff',
      },
    ];

    for (const testingCase of testingCases) {
      it(testingCase.description, async () => {
        const request: any = {
          headers: { 'user-agent': '' },
          ip: testingCase.ip,
        };
        const actual: any = RequestParser.parse((request as unknown) as FastifyRequestWithIpInterface);

        expect(actual.ipAddress).to.be.equal(testingCase.expectedIpAddress);
        expect(actual.ipSubnet).to.be.equal(testingCase.expectedIpSubnet);
      });
    }
  });
});

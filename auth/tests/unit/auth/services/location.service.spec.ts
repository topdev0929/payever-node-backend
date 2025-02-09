// tslint:disable:object-literal-sort-keys
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RabbitMqClient } from '@pe/nest-kit';
import * as chai from 'chai';
import 'mocha';
import * as sinon from 'sinon';
import { RequestFingerprint } from '../../../../src/auth/interfaces';
import { LocationService } from '../../../../src/auth/services/location.service';
import { RequestParser } from '../../../../src/auth/services/request-parser.service';
import { RmqSender } from '../../../../src/common';
import { IpAddressEncoder } from '../../../../src/users';

const expect: Chai.ExpectStatic = chai.expect;

const locationModel: any = {
  findOne: async () => { },
};

const rabbitClient: any = {
  sendAsync: () => { },
};

describe('Testing location service', () => {
  let sandbox: sinon.SinonSandbox;
  let locationService: LocationService;

  before(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationService,
        RmqSender,
        Logger,
        {
          provide: RabbitMqClient,
          useValue: rabbitClient,
        },
        {
          provide: 'LocationModel',
          useValue: locationModel,
        },
      ],
    }).compile();

    locationService = module.get<LocationService>(LocationService);
  });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
  });

  afterEach(async () => {
    await sandbox.restore();
    sandbox = undefined;
  });

  describe('Testing is location known feature', async () => {
    const userId: string = 'a3075c31-852a-4b86-a3ce-00adef2fc098';

    const ukrainianIp: string = '212.92.255.11';
    const belorussianIp: string = '178.122.184.110';

    const ukrainianSubnet: string = IpAddressEncoder.encodeUsersIpAddress('212.92.0.0', null);
    const russianSubnet: string = IpAddressEncoder.encodeUsersIpAddress('93.181.0.0', null);

    const firefoxUserAgent: string = 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:62.0) Gecko/20100101 Firefox/62.0';
    const safariUserAgent: string =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/603.2.4 (KHTML, like Gecko) ' +
      'Version/10.1.1 Safari/603.2.4';
    const chromeUserAgent: string =
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) ' + 'Chrome/70.0.3538.77 Safari/537.36';

    const testingCases: any = [
      {
        description: 'A known location case',
        currentIp: ukrainianIp,
        userAgent: safariUserAgent,
        dbFixtures: [
          {
            userId,
            hashedSubnet: ukrainianSubnet,
            userAgent: safariUserAgent,
          },
          {
            userId,
            hashedSubnet: russianSubnet,
            userAgent: firefoxUserAgent,
          },
        ],
        expectedResult: true,
      },
      {
        description: 'An unknown user-agent case',
        currentIp: ukrainianIp,
        userAgent: chromeUserAgent,
        dbFixtures: [
          {
            userId,
            hashedSubnet: ukrainianSubnet,
            userAgent: safariUserAgent,
          },
          {
            userId,
            hashedSubnet: russianSubnet,
            userAgent: firefoxUserAgent,
          },
        ],
        expectedResult: false,
      },
      {
        description: 'An unknown ip range case',
        currentIp: belorussianIp,
        userAgent: firefoxUserAgent,
        dbFixtures: [
          {
            userId,
            hashedSubnet: ukrainianSubnet,
            userAgent: safariUserAgent,
          },
          {
            userId,
            hashedSubnet: russianSubnet,
            userAgent: firefoxUserAgent,
          },
        ],
        expectedResult: false,
      },
    ];

    for (const testingCase of testingCases) {
      it(testingCase.description, async () => {
        const request: any = {
          clientIp: testingCase.currentIp,
          headers: {
            'user-agent': testingCase.userAgent,
          },
        };
        const parsedRequest: RequestFingerprint = RequestParser.parse(request);

        sandbox.stub(locationModel, 'findOne').callsFake((args: any) => {
          for (const fixture of testingCase.dbFixtures) {
            if (args.userId === fixture.userId
              && args.userAgent === fixture.userAgent
              && fixture.hashedSubnet === args.hashedSubnet) {
              return { exec: () => Promise.resolve(fixture) };
            }
          }

          return { exec: () => Promise.resolve(null) };
        });

        const user: any = { id: userId };

        const actualLocation: boolean = await locationService.isLocationKnown(user, parsedRequest);

        expect(actualLocation).to.be.equal(testingCase.expectedResult);
      });
    }
  });
});

import 'mocha';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import { WidgetSettingTypeEnum } from '../../../src/statistics/enums';
import { StatisticsService } from '../../../src/statistics/services';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('StatisticsService unit tests', () => {
  let sandbox: sinon.SinonSandbox;
  let testService: StatisticsService;
  let widgetService: any;
  let metricService: any;
  let logger: any;

  before(() => {

    widgetService = {
      resolveSetting: (cell: any[], label: WidgetSettingTypeEnum) => { },
    };

    metricService = {
      findAll: (condition: any) => { },
    };
    logger = {
      error: (): any => { },
      log: (): any => { },
      warn: (): any => { },
    } as any;
    testService = new StatisticsService(logger, widgetService, metricService);
  });


  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    sandbox = undefined;
  });

  describe('getData()', () => {
    it('should resolve to [] because no widgetSettings provided', async () => {
      const widget: any = {
        populate: sinon.fake.returns({
          execPopulate: sinon.fake.resolves(null),
        }),
        widgetSettings: [],
      };

      const result: any = await testService.getData(widget);
      expect(result.length).to.eq(0);
    });

    it("should resolve to [['Quantity']] because widgetSettings only has Quantity text setting", async () => {
        const widgetSettings: any = [
          [
            [
              {
                  type: WidgetSettingTypeEnum.Text,
                  value: 'Quantity',
              },
            ],
          ],
        ];
        const widget: any = {
            populate: sinon.fake.returns({
              execPopulate: sinon.fake.resolves(null),
            }),
            widgetSettings: widgetSettings,
        };
        const widgetService: any = {
            resolveSetting: (cell: any[], label: WidgetSettingTypeEnum) => {
                switch (label) {
                  case 'text':
                    {
                      return 'Quantity';
                    }
                  case 'metric':
                    {
                      return [ 'totalCount' ];
                    }
                  case 'dimension':
                    {
                        return [ 'createdAt' ];
                    }
                  case 'filter':
                    {
                        return [];
                    }
                }
            },
          };
        testService = new StatisticsService(logger, widgetService, metricService);

        let result: any;

        try {
           result = await testService.getData(widget);
        } catch (err) {
          console.error(err);
        }

        expect(result.length).to.eq(1);
        expect(result[0][0]).to.eq('Quantity');
      });
  });

});

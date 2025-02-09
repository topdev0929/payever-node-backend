import { DefaultFactory, PartialFactory, partialFactory } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';
import { ApiLogInterface } from '../../src/api-log/interface';

type ApiLogType = ApiLogInterface & { _id: string };

const LocalFactory: DefaultFactory<ApiLogType> = (): ApiLogType => {
  return {
    _id: uuid.v4(),
    request: {
      ips: ['127.0.0.1'],
      body: null,
      headers: {
        'user-agent': 'Artillery (https://artillery.io)',
        authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiOTQ3OTI0YzItNzJhZC00OTU2LTg4YmUtMTFhNGU3MzAxNGIxIiwiZW1haWwiOiJhcnRpbGxlcnlAcGF5ZXZlci5kZSIsImZpcnN0TmFtZSI6ImFydGlsbGVyeSIsImxhc3ROYW1lIjoidGVzdCIsInJvbGVzIjpbeyJuYW1lIjoibWVyY2hhbnQiLCJwZXJtaXNzaW9ucyI6W10sImFwcGxpY2F0aW9ucyI6W119LHsicGVybWlzc2lvbnMiOlsiYWQ4NjcwOGQtODU1MS00Y2FmLTg5Y2ItMDExNDBmMDk3Y2JmIl0sIm5hbWUiOiJhZG1pbi1ubyIsImFwcGxpY2F0aW9ucyI6W119LHsicGVybWlzc2lvbnMiOltdLCJuYW1lIjoidXNlciIsImFwcGxpY2F0aW9ucyI6W119XSwidG9rZW5JZCI6IjAyOGNhZjhjLTA5NWEtNGQ2MS04YTY2LTM1YTI4YzQyODk4YyIsInRva2VuVHlwZSI6MCwiZ2VuZXJhbEFjY291bnQiOnRydWUsImNsaWVudElkIjpudWxsLCJoYXNoIjoiOWNjZjRjYzZlNWFlZjRkZWM2OGYzY2E1Y2Q3MzNiZmM3NjUyNTMyZWRiNjk4YzVmYWJjZWE3NWZiZGNmN2M0OSIsImlzT3duZXIiOnRydWUsInJlbW92ZVByZXZpb3VzVG9rZW5zIjpmYWxzZX0sImlhdCI6MTY3NzE0NjY3MiwiZXhwIjoxNjc4MDQ2NjcyfQ.vi2F4C3fuhppKPX1AVoWC6HgCoqsORiWk7tm0TZ_-i8',
        accept: '*/*',
        'postman-token': '6093d19d-5eb5-4ee9-82b4-526c5977f4d5',
        host: 'localhost:3001',
        'accept-encoding': 'gzip, deflate, br',
        connection: 'keep-alive',
      },
      hostname: 'localhost:3001',
      id: 'req-2',
      ip: '127.0.0.1',
      method: 'GET',
      protocol: 'http',
      query: {
        status: 'success',
        pageSize: '100',
        sort: 'status',
        page: '1',
      },
      routerPath: '/api/notification',
      url: '/api/notification?status=success&pageSize=100&sort=status&page=1',
    },
    response: {
      data: { content: 'this is test' },
      error: undefined,
      headers: {
        vary: 'Origin',
        'access-control-allow-origin': '*',
      },
      statusCode: 201,
    },
    responseTime: 1152,
    serviceName: 'payment-notifications-microservice',
    businessId: 'bd6d07d3-dce0-4287-9e2d-c37797006bce',
    userEmail: 'artillery@payever.de',
    userId: '947924c2-72ad-4956-88be-11a4e73014b1',
    source: 'payever',
  } as any;
};

export class ApiLogFactory {
  public static create: PartialFactory<ApiLogType> = partialFactory<ApiLogType>(LocalFactory);
}

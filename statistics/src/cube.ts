import { CubejsServerCore } from '@cubejs-backend/server-core';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as session from 'express-session';
import * as passport from 'passport';
import * as dotenv from 'dotenv';
import * as cors from 'cors';
import { environment } from './environments';
// eslint-disable-next-line
const MongoBIDriver: any = require('@cubejs-backend/mongobi-driver');

dotenv.config();

const app: express.Application = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(session({ secret: environment.cubejs.apiSecret }));
app.use(passport.initialize());
app.use(passport.session());

if (environment.appCors) {
  app.use(cors());
}

app.get('/status', (req: express.Request, res: express.Response) => {
  res.json({ status: 'ok' });
});

const queueOptions: any = {
  concurrency: 5,
  continueWaitTimeout: 50,
  executionTimeout: 15000,
  orphanedTimeout: 600,
};

const cubejsServerCore = new CubejsServerCore({
  apiSecret: environment.cubejs.apiSecret,
  dbType: 'mongobi',
  driverFactory: () => new MongoBIDriver({
    database: environment.cubejs.dbName,
    host: environment.cubejs.dbHost,
    password: environment.cubejs.dbPass,
    port: environment.cubejs.dbPort,
    user: environment.cubejs.dbUser,
  }),
  orchestratorOptions: {
    queryCacheOptions: {
      queueOptions,
    },
  },
  preAggregationsSchema: 'wa_pre_aggregations',
  schemaPath: '/dist/schemas',
});


cubejsServerCore.initApp(app).catch();

const port: string | number = environment.cubejs.port || 4000;

http.createServer({ }, app).listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Cube.js server is listening on ${ port }`);
});

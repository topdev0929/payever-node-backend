import { Module, HttpStatus } from '@nestjs/common';
import { environment } from '../environments';
import { GqlErrorFormatter } from './error-formatters';
import { GraphQLError, GraphQLScalarType } from 'graphql';
import * as dotenv from 'dotenv';
import { consumerLoader, cronLoader, defaultLoader, httpLoader, wsLoader } from './metadata-loader';

dotenv.config();
interface HttpExceptionMessage {
  message: string;
  error: string;
  statusCode: number;
}

let metadata: any;

switch (true) {
  case process.env.POD === 'http':
    metadata = httpLoader;
    break;
  case process.env.POD === 'consumer':
    metadata = consumerLoader;
    break;
  case process.env.POD === 'cron':
    metadata = cronLoader;
    break;
  case process.env.POD === 'ws':
    metadata = wsLoader;
    break;
  default:
    metadata = defaultLoader;
    break;
}

@Module({
  controllers: [
    ...metadata.controllers,
  ],
  exports: [
    ...metadata.exports,
  ],
  imports: [
    ...metadata.imports,
  ],
  providers: [
    ...metadata.providers,
  ],
})
export class StudioModule { }

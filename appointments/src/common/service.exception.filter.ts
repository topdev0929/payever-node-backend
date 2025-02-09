import { ArgumentsHost, Catch, Logger } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

import { ServiceError, ServiceErrorKind } from '../appointments/services';

const mapErrorKindToCode: any = (kind: ServiceErrorKind): string => {
  let code: string = 'INTERNAL_SERVER_ERROR';

  if (kind === ServiceErrorKind.DuplicateKey) {
    code = 'BAD_USER_INPUT';
  }

  return code;
};

@Catch(ServiceError)
export class ServiceExceptionFilter implements GqlExceptionFilter<ServiceError> {
  constructor(private logger: Logger) { }

  public catch(exception: ServiceError, host: ArgumentsHost): GraphQLError {
    this.logger.log(exception);

    return new GraphQLError(
      exception.message,
      undefined, undefined, undefined, undefined,
      exception,
      { code: mapErrorKindToCode(exception.kind), ...exception.info },
    );
  }
}

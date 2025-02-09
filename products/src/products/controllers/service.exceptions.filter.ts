import { Catch, ArgumentsHost, Logger, HttpStatus, HttpException, ExceptionFilter } from '@nestjs/common';

import { ServiceError, ServiceErrorKind } from '../services';

const mapErrorKindToCode: (kind: ServiceErrorKind) => HttpStatus = (kind: ServiceErrorKind): HttpStatus => {
  let code: number = HttpStatus.INTERNAL_SERVER_ERROR;

  if (kind === ServiceErrorKind.DuplicateKey) {
    code = HttpStatus.BAD_REQUEST;
  }

  return code;
};

@Catch(ServiceError)
export class ServiceExceptionFilters implements ExceptionFilter<ServiceError> {
  constructor(private logger: Logger) { }

  public catch(exception: ServiceError, host: ArgumentsHost): HttpException {
    this.logger.log(exception);

    const code: HttpStatus = mapErrorKindToCode(exception.kind);

    return new HttpException({ status: code, message: exception.message, info: exception.info }, code);
  }
}

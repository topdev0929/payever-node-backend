import { HttpStatus } from '@nestjs/common';

export class GqlErrorFormatter {
  public static formatError(exception: any, isProduction: boolean): any {
    const response: any = { };

    if (!isProduction) {
      Object.assign(response, exception);

      if (
        response &&
        response.extensions &&
        response.extensions.exception &&
        response.extensions.exception.response
      ) {
        response.extensions.exception.message = response.extensions.exception.response;
      }
    }

    response.message = 'Internal server error';

    if (this.isHttpExceptionMessage(exception.extensions.exception.response)) {
      response.error = exception.extensions.exception.response.error;
      response.statusCode = exception.extensions.exception.response.statusCode;

      if (exception.extensions.exception.response.statusCode !== HttpStatus.INTERNAL_SERVER_ERROR) {
        response.message = exception.extensions.exception.response.message;
      }

    }

    return response;
  }

  private static isHttpExceptionMessage(object: any): boolean {
    return (
      typeof object.message === 'string' &&
      typeof object.error === 'string' &&
      typeof object.statusCode === 'number'
    );
  }
}

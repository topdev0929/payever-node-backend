import { HttpStatus } from '@nestjs/common';

export class GqlErrorFormatter {
  public static formatError(exception: any, isProduction: boolean): any {
    const response: any = { };

    if (!isProduction) {
      Object.assign(response, exception);
    }

    response.message = 'Internal server error';

    if (this.isHttpExceptionMessage(exception.message)) {
      response.error = exception.message.error;
      response.statusCode = exception.message.statusCode;

      if (exception.message.statusCode !== HttpStatus.INTERNAL_SERVER_ERROR) {
        response.message = exception.message.message;
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

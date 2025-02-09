import { HttpStatus, HttpException } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { environment } from '../../environments';

export const GqlErrorFormatter: any = (exception: GraphQLError): any => {
  const response: any = { };
  if (!environment.production) {
    Object.assign(response, exception);
  }

  response.message = 'Internal server error';

  switch (true) {
    case isHttpExceptionMessage(exception):
      Object.assign(response, exception.extensions.exception.response);
      break;
    case isGraphQLExceptionMessage(exception):
      response.error = exception.extensions.code;
      response.statusCode = HttpStatus.BAD_REQUEST;
      if (exception.extensions && exception.extensions.code !== 'INTERNAL_SERVER_ERROR') {
        response.message = exception.message;
      }
      break;
    case isDtoValidationException(exception):
      response.statusCode = HttpStatus.BAD_REQUEST;
      response.message = exception.message;
      response.extensions = undefined;
      break;
  }

  return response;
};

function isHttpExceptionMessage(object: GraphQLError): boolean {
  return object.originalError instanceof HttpException;
}

function isGraphQLExceptionMessage(object: any): object is GraphQLError {
  return (
    typeof object.message === 'string' &&
    object.extensions !== null &&
    typeof object.extensions.code === 'string'
  );
}


function isDtoValidationException(object: any): boolean {
  return (
    object.extensions !== null &&
    typeof object.extensions.code === 'string' &&
    object.extensions.exception.status === HttpStatus.BAD_REQUEST
  );
}

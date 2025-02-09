import { Injectable } from '@nestjs/common';
import { StorageError as StorageErrorInterface } from 'azure-storage';

import { AbstractHttpHandler } from '@pe/nest-kit/modules/errors-handler/handlers/abstract-http.handler';
import { ErrorHandler } from '@pe/nest-kit/modules/errors-handler/decorators/error-handler.decorator';
import { ResponseInterface } from '@pe/nest-kit/modules/errors-handler/interfaces/response.interface';

@Injectable()
@ErrorHandler()
export class AzureErrorHandler extends AbstractHttpHandler {

  public handlerName: string = 'azure-error';

  protected prepareResponse(exception: StorageErrorInterface): ResponseInterface {
    return {
      body: exception,
      code: exception.statusCode,
    };
  }
}

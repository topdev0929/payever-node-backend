import { Injectable } from '@nestjs/common';
import { AbstractHttpHandler } from '@pe/nest-kit/modules/errors-handler/handlers/abstract-http.handler';
import { ResponseInterface } from '@pe/nest-kit/modules/errors-handler/interfaces/response.interface';

import {
  BlockedException,
  CaptchaException,
  WrongPasswordException,
  RegisterCaptchaException,
  RegisterBlockedException,
} from '../../brute-force/exceptions';
import { ErrorHandler } from '@pe/nest-kit/modules/errors-handler/decorators/error-handler.decorator';

@Injectable()
@ErrorHandler()
export class ForbiddenErrorHandler extends AbstractHttpHandler{
  public readonly handlerName: string = 'forbidden.handler';
  public readonly shouldLog: boolean = false;

  protected prepareResponse(
    // tslint:disable-next-line max-union-size
    exception: BlockedException | WrongPasswordException | CaptchaException
      | RegisterCaptchaException | RegisterBlockedException,
  ): ResponseInterface {
    return {
      body: {
        message: AbstractHttpHandler.hasMessage(exception.message) ? exception.message.message : exception.message,
        reason: exception.reason,
        statusCode: exception.getStatus(),
      },
      code: exception.getStatus(),
    };
  }
}

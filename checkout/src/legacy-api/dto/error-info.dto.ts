import { ErrorCodeType } from '@pe/nest-kit/modules/errors-handler/types/error-code.type';

export class ErrorInfoDto {
  errors: string[];
  errorCode: ErrorCodeType;
}

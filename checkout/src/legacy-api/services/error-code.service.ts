import { Injectable } from '@nestjs/common';
import { camelCase } from 'lodash';
import { ValidationError, isNumberString } from 'class-validator';
import { LogLevelEnum, ErrorCodesEnum } from '@pe/nest-kit';

@Injectable()
export class ErrorCodeService {
  constructor(
  ) { }

  public getErrorCode(
    errors: ValidationError[],
    transformer: { [key: string]: string },
    logLevel: string = '',
  ): string | string[] {
    const errorCodes: string[] = this.getErrorCodes(errors, transformer);

    if (errorCodes.length === 0) {
      return '';
    }

    if (errorCodes.length === 1) {
      return errorCodes[0];
    }

    return logLevel === LogLevelEnum.debug ? errorCodes : ErrorCodesEnum.generic;
  }

  private getErrorCodes(
    errors: ValidationError[],
    transformer: { [key: string]: string },
    prefix: string = '',
  ): string[] {
    const errorCodes: string[] = [];

    for (const error of errors) {
      if (error && error?.constraints) {
        const [key]: [string, string] = Object.entries(error.constraints)[0];
        const errorCodeHelperKey = camelCase(`${prefix}_${error.property}_${key}`);
        const errorCode: string = transformer[errorCodeHelperKey];
        errorCodes.push(errorCode);
      }

      if (error && error?.children) {
        const propertyPrefix: string = isNumberString(error.property) ? '' : error.property;
        const childrenErrorCodes: string [] =
          this.getErrorCodes(error?.children, transformer, `${prefix}${propertyPrefix}`);

        errorCodes.push(...childrenErrorCodes);
      }
    }

    return errorCodes;
  }
}

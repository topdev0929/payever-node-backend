import { HttpStatus, Injectable, BadRequestException } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { CreatePaymentWrapperDto as V1CreatePaymentWrapperDto } from '../dto/request/v1';
import { CreatePaymentWrapperDto as V2CreatePaymentWrapperDto } from '../dto/request/v2';
import { CreatePaymentWrapperDto as V3CreatePaymentWrapperDto } from '../dto/request/v3';
import { ErrorInfoDto } from '../dto';
import { ErrorCodesEnum, ErrorCodeException } from '@pe/nest-kit';
import { ErrorCodeService } from '../services/error-code.service';
import { ErrorCodeType } from '@pe/nest-kit/modules/errors-handler/types/error-code.type';

type AllowedValidationDto =
  V1CreatePaymentWrapperDto | V2CreatePaymentWrapperDto | V3CreatePaymentWrapperDto;

@Injectable()
export class CreatePaymentValidator {
  constructor(
    private readonly errorCodeService: ErrorCodeService,
  ) { }

  public async validate(
    paymentDto: AllowedValidationDto,
    validationGroups: string[] = [],
  ): Promise<ValidationError[]> {
    const validationErrors: ValidationError[] =
      await validate(paymentDto, { groups: validationGroups });
    if (validationErrors && validationErrors.length) {
      return validationErrors;
    }

    return null;
  }

  public async validateAndThrowError(
    paymentDto: AllowedValidationDto,
    validationGroups: string[] = [],
  ): Promise<void> {
    const validationErrors: ValidationError[] =
      await validate(paymentDto, { groups: validationGroups, validationError: { target: false }});

    if (!validationErrors || !validationErrors.length) {
      return;
    }

    const errorCode: ErrorCodeType = this.errorCodeService.getErrorCode(
      validationErrors,
      ErrorCodesEnum,
      paymentDto.log_level,
    );

    throw new ErrorCodeException(errorCode, validationErrors, HttpStatus.BAD_REQUEST);
  }

  public async getErrorInfo(
    validationResult: ValidationError[],
    errorStrings: string[] = [],
    logLevel: string,
  ): Promise<ErrorInfoDto> {

    return {
      errorCode: this.errorCodeService.getErrorCode(
        validationResult,
        ErrorCodesEnum,
        logLevel,
      ),
      errors: await this.getErrorValidationStrings(validationResult, errorStrings),
    };
  }

  public async getErrorValidationStrings(
    validationResult: ValidationError[],
    errorStrings: string[] = [],
  ): Promise<string[]> {
    if (!validationResult || !Array.isArray(validationResult) || !validationResult.length) {
      return errorStrings;
    }

    for (const error of validationResult) {
      if (!error.constraints && error.children) {
        const childrenErrors: string[] = await this.getErrorValidationStrings(error.children, errorStrings);
        /* eslint-disable-next-line */
        errorStrings.concat(childrenErrors);
      } else {
        errorStrings.push(error.constraints[Object.keys(error.constraints)[0]]);
      }
    }

    return errorStrings;
  }
}

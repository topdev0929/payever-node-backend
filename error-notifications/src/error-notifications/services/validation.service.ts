import { BadRequestException, Global, Injectable } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';

@Global()
@Injectable()
export class ValidationService {
  constructor() { }

  public static async validate(dto: any, validationGroups: string[] = []): Promise<void> {
    const validationErrors: ValidationError[] =
      await validate(dto, { groups: validationGroups });

    if (validationErrors && validationErrors.length) {
      throw new BadRequestException(validationErrors);
    }
  }
}

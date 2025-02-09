import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';

export class ParseOptionalIntPipe implements PipeTransform<string> {
  public async transform(value: string, metadata: ArgumentMetadata): Promise<number | undefined> {
    if (value === '' || value === undefined) {
      return undefined;
    }

    const isNumeric: boolean =
      'string' === typeof value &&
      !isNaN(parseFloat(value)) &&
      isFinite(value as any);
    if (!isNumeric) {
      throw new BadRequestException(
        'Validation failed (numeric string is expected)',
      );
    }

    return parseInt(value, 10);
  }
}

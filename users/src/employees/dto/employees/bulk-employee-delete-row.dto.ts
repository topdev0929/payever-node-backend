import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';

import { BulkDeleteEmployeeRowInterface } from '../../interfaces';
import { Transform } from 'class-transformer';

export class BulkDeleteEmployeeRowDto implements BulkDeleteEmployeeRowInterface {
  @ApiProperty()
  @IsNotEmpty({
    message: 'forms.error.validator.required',
  })
  @IsString({
    message: 'forms.error.validator.email.invalid',
  })
  @IsEmail(undefined, {
    message: 'forms.error.validator.email.invalid',
  })
  @Transform((Email: string) => Email.toLowerCase())
  public 'Email': string;
}

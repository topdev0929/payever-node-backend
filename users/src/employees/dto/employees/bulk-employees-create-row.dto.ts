import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

import { BulkCreateEmployeeRowDto } from './bulk-employee-create-row.dto';

export class BulkCreateEmployeesRowDto extends BulkCreateEmployeeRowDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'forms.error.validator.required',
  })
  @IsString({
    message: 'forms.error.validator.email.invalid',
  })
  public 'Business Id': string;
}

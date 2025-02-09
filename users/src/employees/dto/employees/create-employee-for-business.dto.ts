import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
} from 'class-validator';

import { CreateEmployeeDto } from './create-employee.dto';

export class CreateEmployeeForBusinessDto extends CreateEmployeeDto {
  @ApiProperty()
  @IsString()
  public businessId: string;
}

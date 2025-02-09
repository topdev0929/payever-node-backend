import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EmployeesDto {
  @ApiProperty()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  public employees: string[];
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class EmployeesDto {
  @ApiProperty()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  @IsUUID('4', { each: true })
  public employees: string[];
}

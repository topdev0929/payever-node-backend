import { IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BusinessPaymentsDto {
  @ApiProperty()  
  @IsArray()
  public payments: string[];
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ScheduleRecurringDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  public fulfill: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  public target: number;
}

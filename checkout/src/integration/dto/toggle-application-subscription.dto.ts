import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ToggleApplicationSubscriptionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public code: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public businessId: string;
}

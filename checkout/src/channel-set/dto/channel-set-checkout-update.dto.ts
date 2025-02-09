import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ChannelSetCheckoutUpdateDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public checkoutId: string;
}

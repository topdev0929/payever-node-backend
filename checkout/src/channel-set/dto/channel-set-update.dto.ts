import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class ChannelSetUpdateDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  public active: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  public policyEnabled: boolean;
}

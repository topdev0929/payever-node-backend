import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class ChannelSubscriptionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public business_uuid: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public channel_type: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  public enabled: boolean;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsOptional, IsNumber } from 'class-validator';
import { ChannelDto } from './channel.dto';
import { Type } from 'class-transformer';

export class ChannelSetDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  public legacyId?: number;

  @ApiProperty()
  @IsDefined()
  @Type(() => ChannelDto)
  public channel: ChannelDto;
}

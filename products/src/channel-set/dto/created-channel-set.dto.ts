import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { BusinessDto } from './business.dto';
import { ChannelSetDto } from './channel-set.dto';

export class CreatedChannelSetDto {
  @IsNotEmpty()
  @IsString()
  public id: string;

  @Type(() => BusinessDto)
  public business: BusinessDto;

  @Type(() => ChannelSetDto)
  public channel: ChannelSetDto;
}

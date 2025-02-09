import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BusinessDto } from './business.dto';
import { ChannelSetDto } from './channel-set.dto';

export class CreateTerminalDto {
  @IsString()
  @IsNotEmpty()
  public id: string;

  @IsString()
  public name: string;

  @ValidateNested()
  @Type(() => BusinessDto)
  public business: BusinessDto;

  @ValidateNested()
  @Type(() => ChannelSetDto)
  public channelSet: ChannelSetDto;
}

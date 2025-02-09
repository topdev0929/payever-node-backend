import { IsNotEmpty, IsString } from 'class-validator';
import { BusinessMessageDto } from './business-message.dto';
import { Type } from 'class-transformer';

export class ChannelSetActivatedDto {
  @IsNotEmpty()
  @IsString()
  public id: string;

  @Type(() => BusinessMessageDto)
  public business: BusinessMessageDto;
}

import { IsNotEmpty, IsString } from 'class-validator';
import { BusinessDto } from './business.dto';
import { Type } from 'class-transformer';

export class ActivatedChannelSetDto {
  @IsNotEmpty()
  @IsString()
  public id: string;

  @Type(() => BusinessDto)
  public business: BusinessDto;
}

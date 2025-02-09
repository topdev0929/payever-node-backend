import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { EventSubscriptionConnectionDto } from './event-subscription-connection.dto';
import { EventsEnum } from '../enums';

export class EventSubscriptionDto {
  @ApiProperty({ required: false, type: EventSubscriptionConnectionDto })
  @IsOptional()
  @ValidateNested()
  @Type((): any => EventSubscriptionConnectionDto)
  public connection?: EventSubscriptionConnectionDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsEnum(EventsEnum, { each: true })
  public events?: string[];
}

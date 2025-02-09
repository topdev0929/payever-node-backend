import { 
  IsArray, 
  IsBoolean, 
  IsOptional, 
  IsNotEmpty, 
  IsString, 
  ValidateNested,
  ValidateIf,
  IsNumber,
  IsEnum,
 } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { Weekday } from '../schemas';
import { RangeAvailabilityDto } from './range-availability.dto';
import { WeekdayEnum } from '../enums';

@InputType()
export class WeekdayDto {

  @ApiProperty({
    enum: WeekdayEnum,
  })
  @IsEnum(WeekdayEnum)
  @Field(() => String, {
    nullable: true,
  })
  public name: WeekdayEnum;

  @ApiProperty()
  @IsBoolean()
  @Field(() => Boolean, {
    nullable: true,
  })
  public isEnabled: boolean;

  @ApiProperty()
  @IsOptional()
  @Type(() => RangeAvailabilityDto)
  @ValidateNested()
  @Field(() => [RangeAvailabilityDto], {
    nullable: true,
  })
  public  ranges?: RangeAvailabilityDto[];
}


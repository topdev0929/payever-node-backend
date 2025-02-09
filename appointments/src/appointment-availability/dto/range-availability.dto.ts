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
import { TimeZones, WeekdayEnum } from '../enums';

@InputType()
export class RangeAvailabilityDto {
  @ApiProperty()
  @IsString()
  @Field(() => String)
  public from: string;

  @ApiProperty()
  @IsString()
  @Field(() => String)
  public to: string;
}


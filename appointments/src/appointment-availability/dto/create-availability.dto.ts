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
import { Type } from 'class-transformer';
import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { TimeZones } from '../enums';
import { Weekday } from '../schemas';
import { WeekdayDto } from './weekday.dto';

@InputType()
export class CreateAppointmentAvailabilityDto {

  @ApiProperty()
  @IsBoolean()
  @Field(() => Boolean)
  public isDefault: boolean;
  @ApiProperty({
    enum: TimeZones,
  })
  @IsEnum(TimeZones)
  @Field(() => String, {
    nullable: true,
  })
  public timeZone: TimeZones;

  @ApiProperty()
  @IsString()
  @Field(() => String, {
    nullable: true,
  })
  public name: string;

  @ApiProperty()
  @Type(() => WeekdayDto)
  @ValidateNested()
  @Field(() => [WeekdayDto], {
    nullable: true,
  })
  public  weekDayAvailability: WeekdayDto[];
}


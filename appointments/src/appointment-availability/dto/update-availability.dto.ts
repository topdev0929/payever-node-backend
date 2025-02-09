import { 
  IsArray, 
  IsBoolean, 
  IsOptional, 
  IsNotEmpty, 
  IsString, 
  ValidateNested,
  IsNumber,
  IsEnum,
 } from 'class-validator';
import { Type } from 'class-transformer';
import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { TimeZones } from '../enums';
import { WeekdayDto } from './weekday.dto';

@InputType()
export class UpdateAppointmentAvailabilityDto {

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  public isDefault?: boolean;

  @ApiProperty({
    enum: TimeZones,
  })
  @IsEnum(TimeZones)
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  public timeZone: TimeZones;
  
  @ApiProperty()
  @IsString()
  @IsOptional()
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


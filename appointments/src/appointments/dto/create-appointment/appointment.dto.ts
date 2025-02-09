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

import { AppointmentFieldDto } from './appointment-field.dto';
import { MeasuringEnum } from '../../enums';

@InputType()
export class CreateAppointmentDto {
  @ValidateNested({ each: true })
  @Type(() => AppointmentFieldDto)
  @IsOptional()
  @Field(() => [AppointmentFieldDto], { nullable: true })
  public fields: AppointmentFieldDto[];

  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean)
  public allDay: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean)
  public repeat: boolean;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  public date?: string;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  public time?: string;

  @IsString()
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  public location?: string;

  @IsString()
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  public note?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Field(() => [String], { nullable: true })
  public products?: string[];

  @IsString({ each: true })
  @IsOptional()
  @Field(() => [String], { nullable: true })
  public contacts?: string[];

  @IsString()
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  public appointmentNetwork: string;

  @IsNumber()
  @IsOptional()
  @Field(() => Number, {
    nullable: true,
  })
  public duration?: number;

  @IsEnum(MeasuringEnum)
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  public measuring?: MeasuringEnum;
}

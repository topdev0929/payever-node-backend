import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

import { UpdateAppointmentDtoAppointmentFieldDto } from './appointment-field.dto';
import { MeasuringEnum } from '../../enums';

@InputType()
export class UpdateAppointmentDtoAppointmentDto {
  @ValidateNested({ each: true })
  @IsOptional()
  @Type((() => UpdateAppointmentDtoAppointmentFieldDto))
  @Field(() => [UpdateAppointmentDtoAppointmentFieldDto], {
    nullable: true,
  })
  public fields?: UpdateAppointmentDtoAppointmentFieldDto[];

  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  public allDay?: boolean;

  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  public repeat?: boolean;

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
  public appointmentNetwork?: string;

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

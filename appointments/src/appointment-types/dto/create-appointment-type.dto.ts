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
import { AppointmentTypesEnum, AppointmentDurationUnitsEnum } from '../enums';

@InputType()
export class CreateAppointmentTypeDto {

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Field(() => Number, { nullable: true })
  public dateRange?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  public description?: string;

  @ApiProperty()
  @IsNumber()
  @Field(() => Number)
  public duration: number;

  @ApiProperty()
  @IsString()
  @Field(() => String)
  public eventLink: string;

  @ApiProperty()
  @IsBoolean()
  @Field(() => Boolean)
  public indefinitelyRange: boolean;

  @ApiProperty()
  @IsBoolean()
  @Field(() => Boolean)
  public isDefault: boolean;

  @ApiProperty()
  @IsBoolean()
  @Field(() => Boolean)
  public isTimeAfter: boolean;

  @ApiProperty()
  @IsBoolean()
  @Field(() => Boolean)
  public isTimeBefore: boolean;

  @ApiProperty()
  @IsString()
  @Field(() => String)
  public name: string;

  @ApiProperty()
  @IsString()
  @Field(() => String)
  public schedule: string;

  @ApiProperty()
  @IsNumber()
  @ValidateIf(
    (self: CreateAppointmentTypeDto) => self.isTimeBefore,
  )
  @Field(() => Number, { nullable: true })
  public timeBefore?: number;

  @ApiProperty()
  @IsNumber()
  @ValidateIf(
    (self: CreateAppointmentTypeDto) => self.isTimeAfter,
  )
  @Field(() => Number, { nullable: true })
  public timeAfter?: number;

  @ApiProperty({
    enum: AppointmentTypesEnum,
  })
  @IsEnum(AppointmentTypesEnum)
  @Field(() => String)
  public type: AppointmentTypesEnum;

  @ApiProperty({
    enum: AppointmentDurationUnitsEnum,
  })
  @IsEnum(AppointmentDurationUnitsEnum)
  @Field(() => String)
  public unit: AppointmentDurationUnitsEnum;

  @ApiProperty()
  @IsNumber()
  @Field(() => Number, { nullable: true })
  @ValidateIf((self: CreateAppointmentTypeDto) => self.type === AppointmentTypesEnum.Group,
  )
  public maxInvitees?: number;

}


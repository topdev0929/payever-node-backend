import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  IsString,
  ValidateNested,
  IsNumber,
  IsEnum,
  ValidateIf,
} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { AppointmentTypesEnum, AppointmentDurationUnitsEnum } from '../enums';

@InputType()
export class UpdateAppointmentTypeDto {

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
  @IsOptional()
  @Field(() => Number, { nullable: true })
  public duration?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  public eventLink?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  public indefinitelyRange?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  public isDefault?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  public isTimeAfter?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  public isTimeBefore?: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  public name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  public schedule?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Field(() => Number, { nullable: true })
  public timeBefore?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Field(() => Number, { nullable: true })
  public timeAfter?: number;

  @ApiProperty({
    enum: AppointmentTypesEnum,
  })
  @IsEnum(AppointmentTypesEnum)
  @IsOptional()
  @Field(() => String, { nullable: true })
  public type?: AppointmentTypesEnum;

  @ApiProperty({
    enum: AppointmentDurationUnitsEnum,
  })
  @IsEnum(AppointmentDurationUnitsEnum)
  @IsOptional()
  @Field(() => String, { nullable: true })
  public unit?: AppointmentDurationUnitsEnum;

  @ApiProperty()
  @IsNumber()
  @Field(() => Number, { nullable: true })
  @ValidateIf((self: UpdateAppointmentTypeDto) => self.type === AppointmentTypesEnum.Group,
  )
  public maxInvitees?: number;

}


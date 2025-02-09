import { ApiProperty } from '@nestjs/swagger';
import {
  Allow,
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

import { Positions, Status } from '../../enum';
import { CreateEmployeeInterface } from '../../interfaces';
import { AclInterface } from '@pe/nest-kit';
import { Transform } from 'class-transformer';

export class CreateEmployeeDto implements CreateEmployeeInterface {
  @ApiProperty()
  @IsNotEmpty({
    message: 'forms.error.validator.required',
  })
  @IsString({
    message: 'forms.error.validator.email.invalid',
  })
  @IsEmail(undefined, {
    message: 'forms.error.validator.email.invalid',
  })
  @Transform((email: string) => email.toLowerCase())
  public email: string;

  @ApiProperty()
  @IsOptional()
  public userId: string;

  @ApiProperty()
  @IsOptional()
  public firstName: string;

  @ApiProperty()
  @IsOptional()
  public language?: string;

  @ApiProperty()
  @IsOptional()
  public lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Positions)
  public position: Positions;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Status)
  public status: Status;

  @ApiProperty()
  @IsOptional()
  @IsString({ each: true })
  @IsUUID('4', { each: true })
  @IsArray()
  @ArrayNotEmpty()
  public groups?: string[];

  @ApiProperty()
  @IsOptional()
  public acls?: AclInterface[];

  @Allow()
  public fullValidation: boolean = false;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly logo?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly phoneNumber?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly companyName?: string;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  public readonly address: any;
}

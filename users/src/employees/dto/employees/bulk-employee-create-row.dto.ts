import { ApiProperty } from '@nestjs/swagger';
import {
  Allow,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { Positions, Status } from '../../enum';
import { BulkCreateEmployeeRowInterface } from '../../interfaces';
import { Transform } from 'class-transformer';

export class BulkCreateEmployeeRowDto implements BulkCreateEmployeeRowInterface {
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
  @Transform((Email: string) => Email.toLowerCase())
  public 'Email': string;

  @ApiProperty()
  @IsOptional()
  public 'User Id'?: string;

  @ApiProperty()
  @IsOptional()
  public 'First Name'?: string;

  @ApiProperty()
  @IsOptional()
  public 'Language'?: string;

  @ApiProperty()
  @IsOptional()
  public 'Last Name'?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Positions)
  @IsOptional()
  public 'Position'?: Positions;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Status)
  @IsOptional()
  public 'Status'?: Status;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public 'Groups'?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public 'Acls'?: string;

  @Allow()
  @IsOptional()
  public 'FullValidation'?: boolean = false;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly 'Logo'?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly 'Phone Number'?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly 'Company Name'?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly 'Country'?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly 'City'?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly 'State'?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly 'Street'?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly 'Zipcode'?: string;

  @ApiProperty()
  @IsOptional()
  public 'Confirm Employee'?: boolean = false;
}

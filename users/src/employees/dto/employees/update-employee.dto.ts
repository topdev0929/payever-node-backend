import { ApiProperty } from '@nestjs/swagger';
import { AclInterface } from '@pe/nest-kit';
import { 
  Allow, 
  IsEnum, 
  IsString, 
  IsEmail, 
  IsOptional, 
  IsNotEmpty, 
  ValidateNested,
  IsArray,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';

import { Positions, Status } from '../../enum';
import { UpdateEmployeeInterface } from '../../interfaces';
import { AddressDto } from './address.dto';

export class UpdateEmployeeDto implements UpdateEmployeeInterface {
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
  public groups?: string[];

  @ApiProperty()
  @Allow()
  public acls: AclInterface[];

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
  public readonly address: AddressDto;

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
  public userId: string;

  @ApiProperty()
  public firstName: string;

  @ApiProperty()
  public lastName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly logo: string;
}

import {
  IsString,
  ValidateNested,
  IsArray,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { Positions } from '../enums/positions.enum';
import { Status } from '../enums/status.enum';
import { AclInterface } from '@pe/nest-kit';
import { AddressDto } from './address.dto';


export class EmployeeAccountDto {

  @ValidateNested()
  public address?: AddressDto;

  @IsString()
  public id?: string;

  @IsBoolean()
  public isVerified?: boolean;

  @IsBoolean()
  public isActive?: boolean;

  @IsString()
  public userId?: string;

  @IsString()
  public logo?: string;

  @IsString()
  public first_name: string;

  @IsString()
  public last_name: string;

  @IsString()
  public email: string;

  @IsString()
  public phoneNumber?: string;

  @IsString()
  public companyName?: string;

  @IsString()
  public language?: string;

  @IsEnum(Positions)
  public position?: Positions[];

  @IsArray()
  public acls?: AclInterface[];

  public status?: any;

  @IsArray()
  public groups?: any[];

  @IsString()
  public fullName?: string;

}

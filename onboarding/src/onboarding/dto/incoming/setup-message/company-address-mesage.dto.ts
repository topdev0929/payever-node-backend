import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsISO31661Alpha2,
  IsUppercase,
} from 'class-validator';

export class CompanyAddressMessageDto {
  @ApiProperty()
  @IsISO31661Alpha2()
  @IsUppercase()
  public country: string;

  @ApiProperty()
  @IsString()
  public city: string;

  @ApiProperty()
  @IsString()
  public street: string;

  @ApiProperty()
  @IsString()
  public zipCode: string;
}

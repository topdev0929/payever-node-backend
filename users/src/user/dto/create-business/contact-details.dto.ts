import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ContactDetailsInterface } from '../../interfaces';

export class ContactDetailsDto implements ContactDetailsInterface {
  @ApiProperty()
  @IsString()
  @IsOptional()
  public salutation: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public firstName: string;

  @ApiProperty()
  @IsString()
  public lastName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public phone: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public fax: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public additionalPhone: string;
}

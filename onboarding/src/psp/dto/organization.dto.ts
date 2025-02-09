import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class OrganizationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public _id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public clientId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public clientSecret: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public name: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CustomerPlanDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public _id: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public userId: string;

  @ApiProperty()
  @IsString()
  public name: string;

  @ApiProperty()
  @IsString()
  public image: string;

  @ApiProperty()
  @IsEmail()
  public email: string;

  @ApiProperty()
  @IsString()
  public companyName: string;

  @ApiProperty()
  @IsString()
  public city: string;

  @ApiProperty()
  @IsString()
  public country: string;
}

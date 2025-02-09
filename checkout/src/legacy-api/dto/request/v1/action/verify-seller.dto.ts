import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class VerifySellerDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  public id?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public first_name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public last_name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public email?: string;
}

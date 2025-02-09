import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CommonActionDto } from './common-action.dto';
import { VerifySellerDto } from './verify-seller.dto';

export class VerifyActionDto extends CommonActionDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  public code?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  public pin?: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  public verified?: boolean;

  @ApiProperty()
  @IsOptional()
  public custom?: object;

  @ApiProperty()
  @IsOptional()
  @Type(() => VerifySellerDto)
  public seller?: VerifySellerDto;
}

import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubscriptionPlanBuilderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public business: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public filter: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  public offset: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  public limit: number;
}

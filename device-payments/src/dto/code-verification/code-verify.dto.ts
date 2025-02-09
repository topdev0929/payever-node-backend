import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CodeVerifyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  public merchant_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Transform((value: any) => Number(value))
  public code: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Transform((value: any) => Number(value))
  public amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public token: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  @Transform((value: any) => Boolean(value))
  public verification_step?: boolean = false;

  @ApiProperty()
  @IsOptional()
  public shipping_goods_data: any;
}

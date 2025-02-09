import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  public id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public country?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public currency?: string;

  @ApiProperty()
  @IsNumber()
  public price: number;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  public title: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  public type: string;
}

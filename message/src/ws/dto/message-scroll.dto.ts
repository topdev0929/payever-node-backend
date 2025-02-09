import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateMessageScrollerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public _id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public chat: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  public limit?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  public skip?: number;
}

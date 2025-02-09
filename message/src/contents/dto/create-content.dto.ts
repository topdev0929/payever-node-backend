import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateContentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public business: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public icon?: string;

  @ApiProperty({ example: 'shop/edit' })
  @IsNotEmpty()
  @IsString()
  public name: string;

  @ApiProperty({ example: '' })
  @IsNotEmpty()
  @IsString()
  public url: string;
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { CategoryDto } from './category.dto';

export class ProductBaseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public _id: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsString()
  public businessUuid: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  public price: number;

  @ApiProperty()
  @IsOptional()
  @ValidateNested({
    each: true,
  })
  @Type(() => CategoryDto)
  public categories: CategoryDto[];

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  public title: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsString()
  public image: string;
}

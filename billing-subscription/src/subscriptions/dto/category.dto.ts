import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
} from 'class-validator';

export class CategoryDto {
  @ApiProperty()
  @IsString()
  public _id: string;

  @ApiProperty()
  @IsString()
  public businessId: string;

  @ApiProperty()
  @IsString()
  public slug: string;

  @ApiProperty()
  @IsString()
  public title: string;
}


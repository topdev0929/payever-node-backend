import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AdminCheckoutListDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  public page: number = 1;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  public limit: number = 20;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  public businessIds?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public searchString?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  public query?: any;

  @ApiProperty({ required: false })
  @IsOptional()
  public projection?: any;
}

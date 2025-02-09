import { ApiProperty } from '@nestjs/swagger';
import { Type  } from 'class-transformer';
import { IsOptional, IsString, Min } from 'class-validator';

export class DomainQueryDto {
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
  @IsString({ each: true })
  public businessIds?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public siteId?: string;

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

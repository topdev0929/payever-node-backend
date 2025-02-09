import { ApiProperty } from '@nestjs/swagger';
import { Type  } from 'class-transformer';
import { IsOptional, IsString, Min } from 'class-validator';



export class FileQueryDto {

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
  public projection?: any;

  @ApiProperty({ required: false })
  @IsOptional()
  public sort?: any;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ each: true })
  public applicationIds?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public container?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public nameRegex?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public createdAtLte?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public createdAtGte?: string;


  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public updatedAtLte?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public updatedAtGte?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ each: true })
  public businessIds?: string[];
}

import { ApiProperty } from '@nestjs/swagger';
import { Type  } from 'class-transformer';
import { IsOptional, IsString, Min } from 'class-validator';


export class InventoryQueryDto {
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
  public businessIds?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  public productIds?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  public skuLike: string;

  @ApiProperty({ required: false })
  @IsOptional()
  public sku: string;
}

import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from './pagination.dto';

export class BuilderIntegrationDto {
  @IsOptional()
  @IsString()
  public businessId: string;

  @IsOptional()
  @IsString()
  public contextId: string;

  @IsOptional()
  @IsString()
  public contextString: string;

  @IsOptional()
  public filter: any;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PaginationDto)
  public pagination: PaginationDto;

  @IsOptional()
  public data: any;
}

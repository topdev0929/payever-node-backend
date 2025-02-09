import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IntegrationForBuilderPaginationDto } from './integration-for-builder-pagination.dto';

export class IntegrationForBuilderParamsDto {
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
  @Type(() => IntegrationForBuilderPaginationDto)
  public pagination: IntegrationForBuilderPaginationDto;

  @IsOptional()
  public data: any;
}

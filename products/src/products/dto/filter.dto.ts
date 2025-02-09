import { IsString, IsBoolean, IsArray, IsOptional } from 'class-validator';
import { FilterInterface } from '../../common/interfaces/filter.interface';

export class FilterDto {
  @IsString()
  @IsOptional()
  public channelSetId?: string;

  @IsString()
  @IsOptional()
  public channelSetType?: string;

  @IsBoolean()
  @IsOptional()
  public allBusinesses?: boolean;

  @IsString()
  @IsOptional()
  public marketplaceId?: string;

  @IsBoolean()
  @IsOptional()
  public existInChannelSet?: boolean;

  @IsBoolean()
  @IsOptional()
  public existInMarketplace?: boolean;

  @IsBoolean()
  @IsOptional()
  public withMarketplaces?: boolean;

  @IsArray()
  @IsOptional()
  public excludeIds?: string[];

  @IsArray()
  @IsOptional()
  public includeIds?: string[];

  @IsString()
  @IsOptional()
  public search?: string;

  @IsArray()
  @IsOptional()
  public filters?: FilterInterface[];
}

import { IsString } from 'class-validator';

export class ProductMarketplaceDto {
  @IsString()
  public id: string;
}

import { IsString, IsNotEmpty } from 'class-validator';

export class ProductImageMigratedDto {
  @IsString()
  @IsNotEmpty()
  public productId: string;

  @IsString()
  @IsNotEmpty()
  public imageUrl: string;
}

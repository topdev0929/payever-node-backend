import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsDefined } from 'class-validator';

export class ShopEventDto {
  @IsString()
  @IsNotEmpty()
  public id: string;

  @IsOptional()
  public business: {
    id: string;
  };

  @IsBoolean()
  @IsDefined()
  public default: boolean;

  @IsString()
  @IsOptional()
  public logo: string;

  @IsString()
  @IsOptional()
  public name: string;
}

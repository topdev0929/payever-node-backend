import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class ShopEventDto {
  @IsString()
  @IsNotEmpty()
  public id: string;

  @IsString()
  @IsNotEmpty()
  public appType: string;

  @IsOptional()
  public business: {
    id: string;
  };

  @IsBoolean()
  @IsOptional()
  public default: boolean;

  @IsString()
  @IsOptional()
  public domain: string;

  @IsString()
  @IsOptional()
  public name: string;

  @IsString()
  @IsOptional()
  public logo: string;
}

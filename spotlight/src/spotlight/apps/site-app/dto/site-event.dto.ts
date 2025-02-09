import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class SiteEventDto {
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
  public isDefault: boolean;

  @IsString()
  @IsOptional()
  public domain: string;

  @IsString()
  @IsOptional()
  public name: string;
}

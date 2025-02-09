import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class IntegrationExported {
  @IsNotEmpty()
  @IsString()
  public id: string;

  @IsOptional()
  @IsBoolean()
  public connected: boolean;

  @IsOptional()
  @IsBoolean()
  public installed: boolean;

  @IsNotEmpty()
  @IsString()
  public businessId: string;

  @IsNotEmpty()
  @IsString()
  public name: string;
}

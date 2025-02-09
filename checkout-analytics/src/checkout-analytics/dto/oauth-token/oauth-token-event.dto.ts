import { IsArray, IsString, IsOptional, IsNumber, IsDate } from 'class-validator';

export class OAuthTokenEventDto {
  @IsArray()
  @IsOptional()
  public businesses: string[];

  @IsString()
  @IsOptional()
  public clientId: string;

  @IsNumber()
  @IsOptional()
  public executionTime: number;

  @IsDate()
  @IsOptional()
  public createdAt: Date;
}

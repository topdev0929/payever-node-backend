import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateAccessConfigDto {
  @IsOptional()
  @IsBoolean()
  public isLive?: boolean;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public internalDomain?: string;

  @IsOptional()
  @IsBoolean()
  public isPrivate?: boolean;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public privateMessage?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public privatePassword?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public socialImage?: string;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  public isLocked?: boolean;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public version?: string;
}

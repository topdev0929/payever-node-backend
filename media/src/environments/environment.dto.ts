/* eslint-disable max-classes-per-file */
import { ValidateNested, IsString, IsNumber, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { AppConfigDto } from '@pe/nest-kit';

export class ClamConfigDto {
  @IsBoolean()
  public enabled: boolean;

  @IsString()
  public host: string;

  @IsNumber()
  public port: number;
}


export class LocalConfigDto extends AppConfigDto {
  @IsNumber()
  @IsOptional()
  public statusPort: number;

  @IsString()
  public internalBasicAuthLogin: string;

  @IsString()
  public internalBasicAuthPassword: string;

  @IsString({ each: true })
  public restrictedWallpapersMediaList: string[];

  @IsString()
  public storage_account_name: string;

  @IsString()
  public storage_key: string;

  @IsString()
  public storage_url: string;

  @IsNumber()
  public unusedMediaStoragePeriodDays: number;

  @ValidateNested()
  @Type(() => ClamConfigDto)
  public clamd: ClamConfigDto;
}

import { Exclude, Expose } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

@Exclude()
export class CustomMetricsRequestDto {
  @IsString()
  @IsNotEmpty()
  @Expose()
  public type: string;

  @IsOptional()
  @IsArray()
  @Expose()
  public consoleErrors?: string[];

  @IsString()
  @Expose()
  @IsOptional()
  public userAgent?: string;
}

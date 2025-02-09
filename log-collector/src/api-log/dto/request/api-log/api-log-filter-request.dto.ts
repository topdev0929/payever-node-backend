import { Expose, Exclude } from 'class-transformer';
import { IsString, IsNumber, IsIn, IsOptional, IsDate, Min } from 'class-validator';

@Exclude()
export class ApiLogFilterRequestDto {

  @Expose()
  @IsOptional()
  @IsDate()
  public from?: Date;

  @Expose()
  @IsOptional()
  @IsDate()
  public to?: Date;

  @Expose()
  @IsString()
  @IsOptional()
  public serviceName?: string;

  @Expose()
  @IsString()
  @IsOptional()
  public ip?: string;

  @Expose()
  @IsString()
  @IsOptional()
  public origin?: string;

  @Expose()
  @IsString()
  @IsOptional()
  public source?: string;

  @Expose()
  @IsNumber()
  @IsOptional()
  public page?: number;

  @Expose()
  @IsNumber()
  @IsOptional()
  @Min(1)
  public limit?: number;

  @Expose()
  @IsString()
  @IsOptional()
  public orderBy?: string;

  @Expose()
  @IsString()
  @IsOptional()
  public projection?: any;

  @Expose()
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  public direction?: string;
}

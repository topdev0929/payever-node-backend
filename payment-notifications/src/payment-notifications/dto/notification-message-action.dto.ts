import { Exclude, Expose } from 'class-transformer';
import { IsString, IsNumber, IsOptional } from 'class-validator';

@Exclude()
export class NotificationMessageActionDto {
  @IsString()
  @IsOptional()
  @Expose()
  public type?: string;

  @IsNumber()
  @IsOptional()
  @Expose()
  public amount?: number;

  @IsString()
  @IsOptional()
  @Expose()
  public source?: string;

  @IsString()
  @IsOptional()
  @Expose()
  public reference?: string;

  @IsString()
  @IsOptional()
  @Expose()
  public unique_identifier?: string;
}

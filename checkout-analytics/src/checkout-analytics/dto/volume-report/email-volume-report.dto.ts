import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class EmailVolumeReportDto {
  @IsString()
  @Expose()
  public to: string;

  @IsString()
  @Expose()
  public cc: string;

  @IsString()
  @Expose()
  public reportContent: string;

  @IsString()
  @Expose()
  public reportDate: string;
}

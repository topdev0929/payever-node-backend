import { IsNumber } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ChartsTotalVolumeDto {
  @IsNumber()
  @Expose()
  public month: number;

  @IsNumber()
  @Expose()
  public total: number;
}

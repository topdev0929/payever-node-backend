import { IsOptional, IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class OnboardPurchaserCustomRequestDto {
  @Expose()
  @IsOptional()
  @IsString()
  public designating_primary_id?: string;

  @Expose()
  @IsOptional()
  @IsString()
  public id_number?: string;
}

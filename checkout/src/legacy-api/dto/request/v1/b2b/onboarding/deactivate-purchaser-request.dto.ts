import { IsNotEmpty, IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class DeactivatePurchaserRequestDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  public external_id: string;
}

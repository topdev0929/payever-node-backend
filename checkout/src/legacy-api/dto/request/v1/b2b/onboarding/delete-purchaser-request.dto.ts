import { IsNotEmpty, IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class DeletePurchaserRequestDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  public external_id: string;
}

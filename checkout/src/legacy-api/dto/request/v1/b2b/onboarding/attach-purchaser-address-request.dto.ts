import { ArrayMinSize, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { PurchaserAddressRequestDto } from './purchaser-address-request.dto';

@Exclude()
export class AttachPurchaserAddressRequestDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  public external_id: string;

  @Expose()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PurchaserAddressRequestDto)
  public addresses: PurchaserAddressRequestDto[];
}

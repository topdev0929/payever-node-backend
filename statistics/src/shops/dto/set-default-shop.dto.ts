import { IsNotEmpty, IsString } from 'class-validator';

export class SetDefaultShopDto {
  @IsString()
  @IsNotEmpty()
  public businessId: string;

  @IsString()
  @IsNotEmpty()
  public shopId: string;
}

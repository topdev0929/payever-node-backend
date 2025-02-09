import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveShopDto {
  @IsString()
  @IsNotEmpty()
  public id: string;
}

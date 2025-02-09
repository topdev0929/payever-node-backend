import { IsString, IsNotEmpty } from 'class-validator';

export class RemoveProductDto {
  @IsString()
  @IsNotEmpty()
  public _id: string;

  @IsString()
  @IsNotEmpty()
  public businessUuid: string;
}

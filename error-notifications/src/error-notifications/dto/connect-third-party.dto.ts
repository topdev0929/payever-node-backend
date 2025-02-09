import { IsString, IsNotEmpty } from 'class-validator';

export class ConnectThirdPartyDto {
  @IsString()
  @IsNotEmpty()
  public businessId: string;

  @IsString()
  @IsNotEmpty()
  public category: string;

  @IsString()
  @IsNotEmpty()
  public name: string;
}

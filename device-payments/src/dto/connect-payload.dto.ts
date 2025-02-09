import { ConnectPayloadInterface } from '../interfaces';
import { IsString, IsNotEmpty } from 'class-validator';

export class ConnectPayloadDto implements ConnectPayloadInterface {
  @IsString()
  public name: string;

  @IsString()
  public category: string;

  @IsString()
  @IsNotEmpty()
  public businessId: string;
}

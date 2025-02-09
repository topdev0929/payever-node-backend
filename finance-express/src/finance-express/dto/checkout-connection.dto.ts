import { IsNotEmpty } from 'class-validator';
import { ConnectionDto, CheckoutDto, IntegrationDto } from './';

export class CheckoutConnectionDto {
  @IsNotEmpty()
  public checkout: CheckoutDto;

  @IsNotEmpty()
  public connection: ConnectionDto;

  @IsNotEmpty()
  public integration: IntegrationDto;
}

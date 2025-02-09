import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CheckoutSettingsPayloadInterface } from '../../../interfaces/outgoing';
import { CheckoutStylesDto } from './checkout-styles.dto';

export class CheckoutSettingsSetupMessageDto implements CheckoutSettingsPayloadInterface {
  @ApiProperty()
  @Type(() => CheckoutStylesDto)
  @ValidateNested()
  public styles: CheckoutStylesDto;
}

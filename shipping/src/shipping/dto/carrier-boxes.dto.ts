import { ApiProperty } from '@nestjs/swagger';
import { IntegrationInterface } from '../../integration';
import { ShippingBoxModel } from '../models';

export class CarrierBoxesDto {
  @ApiProperty()
  public integration: IntegrationInterface;

  @ApiProperty()
  public boxes: ShippingBoxModel[];

  @ApiProperty()
  public enabled?: boolean;
}

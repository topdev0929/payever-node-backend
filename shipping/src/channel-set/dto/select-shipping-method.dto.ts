import { IsNotEmpty, IsString, IsDefined } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SelectShippingMethodDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  public shippingOrderId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  public integrationSubscriptionId: string;
}

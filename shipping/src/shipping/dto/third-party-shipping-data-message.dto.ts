import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { BusinessModel } from '../../business';
import { IntegrationModel } from '../../integration';
import { ShippingBoxInterface } from '../interfaces';

export class ThirdPartyShippingDataMessageDto {
    @ApiProperty()
    public business: BusinessModel;

    @ApiProperty()
    public integration: IntegrationModel;

    @ApiPropertyOptional()
    public handlingFeePercentage: number;

    @ApiPropertyOptional()
    public flatAmount: number;

    @ApiPropertyOptional()
    public shippingBoxes: ShippingBoxInterface[];
}

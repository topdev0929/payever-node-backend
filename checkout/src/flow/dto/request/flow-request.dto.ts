import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { FlowCartItemRequestDto } from './flow-cart-item-request.dto';
import { FlowAddressRequestDto } from './flow-address-request.dto';
import { FlowInterface } from '../../interfaces';
import { FlowFooterUrlsRequestDto } from './flow-footer-urls-request.dto';

export class FlowRequestDto implements Omit<FlowInterface, 'id' | 'state'> {
  @ApiProperty({ required: true})
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  public channelSetId: string;

  @ApiProperty({ required: false})
  @IsString()
  @IsOptional()
  @Type(() => String)
  public channelSource?: string;

  @ApiProperty({ required: false})
  @IsString()
  @IsOptional()
  @Type(() => String)
  public connectionId?: string;

  @ApiProperty({ required: false})
  @IsString()
  @IsOptional()
  @Type(() => String)
  public apiCallId?: string;

  @ApiProperty({ required: false})
  @IsString()
  @IsOptional()
  @Type(() => String)
  public orderId?: string;

  @ApiProperty({ required: false})
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  public amount?: number;

  @ApiProperty({ required: false})
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  public downPayment?: number;

  @ApiProperty({ required: false})
  @IsString()
  @IsOptional()
  @Type(() => String)
  public currency?: string;

  @ApiProperty({ required: false})
  @IsString()
  @IsOptional()
  @Type(() => String)
  public reference?: string;

  @ApiProperty({ required: false})
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FlowCartItemRequestDto)
  public cart?: FlowCartItemRequestDto[];

  @ApiProperty({ required: false})
  @IsOptional()
  @ValidateNested()
  @Type(() => FlowAddressRequestDto)
  public billingAddress?: FlowAddressRequestDto;

  @ApiProperty({ required: false})
  @IsOptional()
  @ValidateNested()
  @Type(() => FlowAddressRequestDto)
  public shippingAddress?: FlowAddressRequestDto;

  @ApiProperty({ required: false})
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  public deliveryFee?: number;

  @ApiProperty({ required: false})
  @IsString()
  @IsOptional()
  @Type(() => String)
  public shippingMethodCode?: string;

  @ApiProperty({ required: false})
  @IsString()
  @IsOptional()
  @Type(() => String)
  public shippingMethodName?: string;

  @ApiProperty({ required: false})
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  public posMerchantMode?: boolean;

  @ApiProperty({ required: false})
  @IsNumber()
  @IsOptional()
  public posVerifyType?: number;

  @ApiProperty({ required: false})
  @IsString()
  @IsOptional()
  @Type(() => String)
  public coupon?: string;

  @ApiProperty({ required: false})
  @IsString()
  @IsOptional()
  @Type(() => String)
  public pluginVersion?: string;

  @ApiProperty({ required: false})
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  public forceLegacyCartStep?: boolean;

  @ApiProperty({ required: false})
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  public forceLegacyUseInventory?: boolean;

  @ApiProperty({ required: false})
  @IsOptional()
  public extra?: any;

  @ApiProperty({ required: false})
  @IsString()
  @IsOptional()
  public noticeUrl?: string;

  @ApiProperty({ required: false})
  @IsString()
  @IsOptional()
  public cancelUrl?: string;

  @ApiProperty({ required: false})
  @IsString()
  @IsOptional()
  public customerRedirectUrl?: string;

  @ApiProperty({ required: false})
  @IsString()
  @IsOptional()
  public failureUrl?: string;

  @ApiProperty({ required: false})
  @IsString()
  @IsOptional()
  public pendingUrl?: string;

  @ApiProperty({ required: false})
  @IsString()
  @IsOptional()
  public successUrl?: string;

  @ApiProperty({ required: false})
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  public hideLogo?: boolean;

  @ApiProperty({ required: false})
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  public hideImprint?: boolean;

  @ApiProperty({ required: false})
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  public disableValidation?: boolean;

  @ApiProperty({ required: false})
  @IsOptional()
  @ValidateNested()
  @Type(() => FlowFooterUrlsRequestDto)
  public footerUrls?: FlowFooterUrlsRequestDto;

  // calculated field, not for request
  public total?: number;
}

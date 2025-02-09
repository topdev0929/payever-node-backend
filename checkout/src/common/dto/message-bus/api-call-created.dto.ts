import { VerifyTypeEnum } from '../../../legacy-api/enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { ApiCallCreatedAddressDto } from './api-call-created-address.dto';
import { ApiCallCreatedSellerDto } from './api-call-created-seller.dto';
import { SalutationEnum } from '../../enum';
import { ApiCallCreatedCartItemDto } from './api-call-created-cart-item.dto';

@Exclude()
export class ApiCallCreatedDto {
  @ApiProperty()
  @IsString()
  @Expose()
  public businessId: string;
  
  @ApiProperty()
  @IsString()
  @Expose({ name: 'payment_issuer' })
  public paymentIssuer: string;
  
  @ApiProperty()
  @IsString()
  @Expose({ name: 'payment_method' })
  public paymentMethod: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public channel: string;

  @ApiProperty()
  @IsString()
  @Expose({ name: 'channel_set_id' })
  public channelSetId: string;

  @ApiProperty()
  @IsNumber()
  @Expose()
  public amount: number;

  @ApiProperty()
  @IsNumber()
  @Expose({ name: 'down_payment' })
  public downPayment: number;

  @ApiProperty()
  @IsString()
  @Expose({ name: 'order_id' })
  public orderId: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public currency: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public flowId?: string;

  @ApiProperty()
  @IsNumber()
  @Expose()
  public fee?: number;


  @ApiProperty()
  @Type(() => ApiCallCreatedCartItemDto)
  @Expose()
  public cart?: ApiCallCreatedCartItemDto[];

  @ApiProperty()
  @Expose()
  public salutation?: SalutationEnum;

  @ApiProperty()
  @IsString()
  @Expose({ name: 'first_name' })
  public firstName?: string;

  @ApiProperty()
  @IsString()
  @Expose({ name: 'last_name' })
  public lastName?: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public street?: string;

  @ApiProperty()
  @IsString()
  @Expose({ name: 'street_number' })
  public streetNumber?: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public city?: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public zip?: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public region?: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public country?: string;

  @ApiProperty()
  @IsString()
  @Expose({ name: 'address_line_2' })
  public addressLine2?: string;

  @ApiProperty()
  @IsString()
  @Expose({ name: 'social_security_number' })
  public socialSecurityNumber?: string;

  @ApiProperty()
  @IsDate()
  @Expose()
  public birthdate?: Date;

  @ApiProperty()
  @IsString()
  @Expose()
  public phone?: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public email?: string;

  @ApiProperty()
  @Type(() => ApiCallCreatedAddressDto)
  @Expose({ name: 'shipping_address' })
  public shippingAddress?: ApiCallCreatedAddressDto;

  @ApiProperty()
  @IsString()
  @Expose({ name: 'success_url' })
  public successUrl?: string;

  @ApiProperty()
  @IsString()
  @Expose({ name: 'pending_url' })
  public pendingUrl?: string;

  @ApiProperty()
  @IsString()
  @Expose({ name: 'failure_url' })
  public failureUrl?: string;

  @ApiProperty()
  @IsString()
  @Expose({ name: 'cancel_url' })
  public cancelUrl?: string;

  @ApiProperty()
  @IsString()
  @Expose({ name: 'notice_url' })
  public noticeUrl?: string;

  @ApiProperty()
  @IsString()
  @Expose({ name: 'customer_redirect_url' })
  public customerRedirectUrl?: string;

  @ApiProperty()
  @IsString()
  @Expose({ name: 'x_frame_host' })
  public xFrameHost?: string;

  @ApiProperty()
  @IsString()
  @Expose({ name: 'plugin_version' })
  public pluginVersion?: string;

  @ApiProperty()
  @IsString()
  @Expose({ name: 'variant_id' })
  public variantId?: string;

  @ApiProperty()
  @Expose()
  public extra?: any;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Expose({ name: 'client_id' })
  public clientId?: string;

  @ApiProperty()
  @IsString()
  @Expose({ name: 'execution_time' })
  public executionTime: string;

  @ApiProperty()
  @IsDate()
  @Expose()
  public createdAt: Date;

  @ApiProperty()
  @IsDate()
  @Expose()
  public updatedAt: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Expose()
  public locale?: string;

  @ApiProperty()
  @IsEnum(VerifyTypeEnum)
  @Expose({ name: 'verify_type' })
  public verifyType: VerifyTypeEnum;

  @ApiProperty()
  @Type(() => ApiCallCreatedSellerDto)
  @Expose()
  public seller?: ApiCallCreatedSellerDto;
}

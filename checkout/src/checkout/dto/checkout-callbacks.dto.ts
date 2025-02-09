import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { CheckoutCallbacksInterface } from '../interfaces';

export class CheckoutCallbacksDto implements CheckoutCallbacksInterface {
  @ApiProperty({ required: false })
  @IsOptional({ groups: ['create', 'update'] })
  @IsString({ groups: ['create', 'update'] })
  public cancelUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional({ groups: ['create', 'update'] })
  @IsString({ groups: ['create', 'update'] })
  public customerRedirectUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional({ groups: ['create', 'update'] })
  @IsString({ groups: ['create', 'update'] })
  public failureUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional({ groups: ['create', 'update'] })
  @IsString({ groups: ['create', 'update'] })
  public noticeUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional({ groups: ['create', 'update'] })
  @IsString({ groups: ['create', 'update'] })
  public pendingUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional({ groups: ['create', 'update'] })
  @IsString({ groups: ['create', 'update'] })
  public successUrl?: string;
}

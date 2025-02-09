import { IsBoolean, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionNetworkDto } from '..';

export class AdminSubscriptionNetworkCreateDto extends SubscriptionNetworkDto {
  @ApiProperty()
  @IsString()
  public businessId: string;
}

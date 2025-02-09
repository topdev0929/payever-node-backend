import { AddressDto } from './address.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsDefined, ValidateNested, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class ProcessShippingOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  public businessName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  public transactionId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  public legalText: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDefined()
  @ValidateNested()
  @Type(() => AddressDto)
  public billingAddress: AddressDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public shippedAt?: string;
}

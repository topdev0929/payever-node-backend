import { Expose, Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaymentLinkSellerInterface } from '../../interfaces';

@Exclude()
export class PaymentLinkSellerDto implements PaymentLinkSellerInterface {
  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsString()
  public id?: string;

  @Expose( { name: 'firstName'})
  @ApiProperty({ required: false, name: 'firstName'})
  @IsOptional()
  @IsString()
  public first_name?: string;

  @Expose( { name: 'lastName'})
  @ApiProperty({ required: false, name: 'lastName'})
  @IsOptional()
  @IsString()
  public last_name?: string;

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsString()
  public email?: string;
}

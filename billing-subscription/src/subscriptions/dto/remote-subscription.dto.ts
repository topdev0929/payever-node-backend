import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RemoteSubscriptionDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  public id: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  public subscriptionPlanId: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  public transactionUuid: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  public businessId: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  public userId: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  public customerEmail: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  public customerName: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  public reference: string;
}

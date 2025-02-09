import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SubscriptionChangedDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  public externalId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  public paymentMethod: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  public subscriptionState: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  public trialEnd: Date;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDate } from 'class-validator';

export class NotificationFailedDto {
  @ApiProperty()
  @IsString()
  public businessId: string;

  @ApiProperty()
  @IsNumber()
  public deliveryAttempts: number;

  @ApiProperty()
  @IsDate()
  public firstFailure: Date;

  @ApiProperty()
  @IsString()
  public noticeUrl: string;

  @ApiProperty()
  @IsString()
  public paymentId: string;

  @ApiProperty()
  @IsString()
  public statusCode: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ErrorNotificationEventDto } from './';

@Exclude()
export class ErrorNotificationLastTransactionTimeEventDto  {
  @ApiProperty()
  @IsString()
  @Expose()
  public businessId: string;

  @ApiProperty()
  @Expose()
  public transactions: ErrorNotificationEventDto[];
}

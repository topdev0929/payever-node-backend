import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ErrorNotificationTransactionItemDto } from './';

@Exclude()
export class ErrorNotificationEventDto {
  @ApiProperty()
  @IsString()
  @Expose()
  public businessId: string;

  @ApiProperty()
  @Expose()
  public transactions: ErrorNotificationTransactionItemDto[];
}

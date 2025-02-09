import { IsDateString, IsString } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { NotificationMessageDataDto } from './notification-message-data.dto';

@Exclude()
export class NotificationMessageDto {
  @IsString()
  @Expose()
  public notification_type: string;

  @IsDateString()
  @Expose()
  public created_at: Date;

  @Type(() => NotificationMessageDataDto)
  @Expose()
  public data: NotificationMessageDataDto;
}

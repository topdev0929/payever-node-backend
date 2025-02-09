import { NotificationResponseDto } from './notification-response.dto';

export class NotificationFilterResultDto {
  public total: number;
  public totalPages: number;
  public page: number;
  public events: NotificationResponseDto[];
}

import { ErrorNotificationAggregateDto, ErrorNotificationEmailDto } from '../dto';

export interface EmailTransformerInterface {
  notificationErrorToEmailDto(aggregateDto: ErrorNotificationAggregateDto): Promise<ErrorNotificationEmailDto>;
}

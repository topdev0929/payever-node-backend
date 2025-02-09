import { ErrorNotificationAggregateDto, ErrorNotificationEmailDto } from '../../../dto';
import { EmailTransformerInterface, ErrorNotificationInterface } from '../../../interfaces';
import { DateTransformer } from '../../../transformers';

export abstract class AbstractTransformer implements EmailTransformerInterface {

  public abstract notificationErrorToEmailDto(
    aggregateDto: ErrorNotificationAggregateDto,
  ): Promise<ErrorNotificationEmailDto>;

  protected transformErrors(sourceErrors: ErrorNotificationInterface[], integration?: string): any[] {
    return sourceErrors.map( (item: ErrorNotificationInterface) => {
      return {
        ...item.errorDetails,
        errorDateFormatted: item.errorDate ?
          DateTransformer.convertUTCToCETTimeZoneAndFormat(item.errorDate) : undefined,
        integration: integration ? integration : item.errorDetails.integration ?
          item.errorDetails.integration : undefined,
      };
    });
  }

}

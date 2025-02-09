import { Injectable } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit';
import { EMAIL_TRANSFORMER } from '../../../constants';
import { ErrorNotificationAggregateDto, ErrorNotificationEmailDto } from '../../../dto';
import { EmailTemplateNamesEnum, ErrorNotificationTypesEnum } from '../../../enums';
import { AbstractTransformer } from './';
import * as moment from 'moment';
import { ErrorNotificationInterface } from '../../../interfaces';
import { DateTransformer } from '../../../transformers';

@Injectable()
@ServiceTag(EMAIL_TRANSFORMER)
export class LastTransactionTimeTransformer extends AbstractTransformer {

  public async notificationErrorToEmailDto(
    aggregateDto: ErrorNotificationAggregateDto,
  ): Promise<ErrorNotificationEmailDto> {
    if (aggregateDto.type !== ErrorNotificationTypesEnum.lastTransactionTime) {
      return;
    }

    return {
      businessId: aggregateDto.businessId,
      locale: 'en',
      templateName: EmailTemplateNamesEnum.lastTransactionTime,
      variables: {
        errors: this.fillTimeAgo(aggregateDto.errors),
      },
    };
  }

  private fillTimeAgo(sourceErrors: ErrorNotificationInterface[]): any[] {
    return sourceErrors.map( (item: ErrorNotificationInterface) => {
      return {
        errorDateFormatted: item.errorDate ?
          DateTransformer.convertUTCToCETTimeZoneAndFormat(item.errorDate) : undefined,
        integration: item.integration,
        timeAgo: moment(item.errorDate).fromNow(),
      };
    });
  }

}

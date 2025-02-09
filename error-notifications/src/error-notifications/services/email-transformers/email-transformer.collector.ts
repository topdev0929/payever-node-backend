import { Injectable } from '@nestjs/common';
import { AbstractCollector, Collector } from '@pe/nest-kit';
import { EMAIL_TRANSFORMER } from '../../constants';
import { ErrorNotificationAggregateDto, ErrorNotificationEmailDto } from '../../dto';
import { EmailTransformerInterface } from '../../interfaces';

@Injectable()
@Collector(EMAIL_TRANSFORMER)
export class EmailTransformerCollector extends AbstractCollector {
  protected services: EmailTransformerInterface[];

  public async transformNotificationErrorToEmailDto(
    errorNotification: ErrorNotificationAggregateDto,
  ): Promise<ErrorNotificationEmailDto[]> {

    const result: ErrorNotificationEmailDto[] = [];

    for (const transformer of this.services) {
      const emailDto: ErrorNotificationEmailDto =
        await transformer.notificationErrorToEmailDto(errorNotification);

      if (emailDto) {
        result.push(emailDto);
      }
    }

    return result;
  }

}

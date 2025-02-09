import { Exclude, Expose } from 'class-transformer';
import { ErrorNotificationInterface } from '../interfaces';
import { ErrorNotificationTypesEnum } from '../enums';

@Exclude()
export class ErrorNotificationAggregateDto {
  @Expose()
  public businessId: string;

  @Expose()
  public type: ErrorNotificationTypesEnum;

  @Expose()
  public integration?: string;

  @Expose()
  public errors: ErrorNotificationInterface[];
}

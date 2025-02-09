import { Expose } from 'class-transformer';
import { IsDateString, IsString } from 'class-validator';
import { createHash } from 'crypto';
import { v4 as uuid } from 'uuid';
import { BusinessModel } from '../../../business';
import { ChannelSetModel } from '../../../channel-set';
import { ApiCallResponseInterface } from '../../interfaces';

export class ApiCallBusinessPaymentMethodLimitsDto implements ApiCallResponseInterface{
  @IsString()
  @Expose()
  public readonly id: string;

  @IsString()
  @Expose()
  public readonly status: string = 'success';

  @IsDateString()
  @Expose()
  public readonly created_at: Date;

  @IsString()
  @Expose()
  public readonly business_id: string;

  @IsString()
  @Expose()
  public readonly action: string = 'payment_method_limits';

  @IsString()
  @Expose()
  public readonly channel: string;

  constructor(business: BusinessModel, channelSet?: ChannelSetModel, status?: string) {
    this.id = createHash('md5').update(uuid()).digest('hex');
    this.created_at = new Date();
    this.business_id = business.id;

    if (status) {
      this.status = status;
    }
  }
}

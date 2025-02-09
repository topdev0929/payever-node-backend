import { Expose } from 'class-transformer';
import { IsDateString, IsString } from 'class-validator';
import { createHash } from 'crypto';
import { v4 as uuid } from 'uuid';
import { BusinessModel } from '../../../business';
import { ApiCallResponseInterface } from '../../interfaces';

export class ApiCallBusinessListChannelSetsDto implements ApiCallResponseInterface{
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
  public readonly action: string = 'list_channel_sets';

  constructor(business: BusinessModel, status?: string) {
    this.id = createHash('md5').update(uuid()).digest('hex');
    this.created_at = new Date();
    this.business_id = business.id;

    if (status) {
      this.status = status;
    }
  }
}

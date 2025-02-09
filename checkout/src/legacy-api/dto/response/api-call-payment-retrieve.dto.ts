import { Exclude, Expose } from 'class-transformer';
import { IsDateString, IsString } from 'class-validator';
import { createHash } from 'crypto';
import { v4 as uuid } from 'uuid';
import { ApiCallResponseInterface } from '../../interfaces';

@Exclude()
export class ApiCallPaymentRetrieveDto implements ApiCallResponseInterface{
  @IsString()
  @Expose()
  public readonly id: string;

  @IsString()
  @Expose()
  public readonly status: string = 'success';

  @IsDateString()
  @Expose()
  public readonly created_at: Date;

  constructor() {
    this.id = createHash('md5').update(uuid()).digest('hex');
    this.created_at = new Date();
  }
}

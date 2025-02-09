import { Exclude, Expose } from 'class-transformer';
import { IsDateString, IsNumber, IsString } from 'class-validator';
import { createHash } from 'crypto';
import { v4 as uuid } from 'uuid';
import { ApiCallResponseInterface } from '../../interfaces';
import { PaymentListFilterDto } from '../request/v1';

@Exclude()
export class ApiCallPaymentListDto implements ApiCallResponseInterface{
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
  public readonly payment_issuer?: string;
  
  @IsString()
  @Expose()
  public readonly payment_method?: string;
  
  @IsString()
  @Expose()
  public readonly date?: string;

  @IsString()
  @Expose()
  public readonly currency?: string;

  @IsString()
  @Expose()
  public readonly state?: string;

  @IsNumber()
  @Expose()
  public readonly limit: number;

  @IsString()
  @Expose()
  public readonly type: string = 'list';

  constructor(
    filterDTO: PaymentListFilterDto,
    status?: string,
  ) {
    this.id = createHash('md5').update(uuid()).digest('hex');
    this.created_at = new Date();

    this.payment_method = filterDTO.paymentMethod;
    this.date = filterDTO.date;
    this.currency = filterDTO.currency;
    this.state = filterDTO.status;
    this.limit = filterDTO.limit;

    if (status) {
      this.status = status;
    }
  }
}

import { Exclude, Expose } from 'class-transformer';
import { IsDateString, IsString } from 'class-validator';
import { ApiCallResponseInterface } from '../../interfaces';

@Exclude()
export class ApiCallPaymentSubmitFailedDto implements ApiCallResponseInterface {
  @IsString()
  @Expose()
  public id: string;

  @IsString()
  @Expose()
  public status: string = 'new';

  @IsDateString()
  @Expose()
  public created_at: Date;

  @IsString()
  @Expose({ name: 'businessId' })
  public readonly business_id: string;

  @IsString()
  @Expose()
  public type: string = 'submit';

  public setId(id: string): ApiCallPaymentSubmitFailedDto {
    this.id = id;

    return this;
  }

  public setStatus(status: string): ApiCallPaymentSubmitFailedDto {
    this.status = status;

    return this;
  }

  public setCreatedAt(createdAt: Date): ApiCallPaymentSubmitFailedDto {
    this.created_at = createdAt;

    return this;
  }

  public setType(type: string): ApiCallPaymentSubmitFailedDto {
    this.type = type;

    return this;
  }
}

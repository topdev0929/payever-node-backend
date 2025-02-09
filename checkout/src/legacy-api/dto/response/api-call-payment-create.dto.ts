import { Exclude, Expose } from 'class-transformer';
import { IsDateString, IsString } from 'class-validator';
import { ApiCallResponseInterface } from '../../interfaces';
import { CreatePaymentDto } from '../request/common';

@Exclude()
export class ApiCallPaymentCreateDto extends CreatePaymentDto implements ApiCallResponseInterface {
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
  @Expose()
  public type: string = 'create';

  public setId(id: string): ApiCallPaymentCreateDto {
    this.id = id;

    return this;
  }

  public setStatus(status: string): ApiCallPaymentCreateDto {
    this.status = status;

    return this;
  }

  public setCreatedAt(createdAt: Date): ApiCallPaymentCreateDto {
    this.created_at = createdAt;

    return this;
  }

  public setType(type: string): ApiCallPaymentCreateDto {
    this.type = type;

    return this;
  }
}

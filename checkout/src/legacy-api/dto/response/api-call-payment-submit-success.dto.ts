import { Exclude, Expose } from 'class-transformer';
import { IsDateString, IsString } from 'class-validator';
import { ApiCallResponseInterface } from '../../interfaces';

@Exclude()
export class ApiCallPaymentSubmitSuccessDto implements ApiCallResponseInterface{
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
  public readonly code: number;

  constructor(id: string, code: number) {
    this.id = id;
    this.created_at = new Date();
    this.code = code;
  }
}

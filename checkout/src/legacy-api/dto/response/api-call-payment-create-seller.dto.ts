import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { ApiCallSellerInterface } from '../../../common/interfaces';

@Exclude()
export class ApiCallPaymentCreateSellerDto implements ApiCallSellerInterface {
  @IsString()
  @IsOptional()
  @Expose()
  public id?: string;

  @IsString()
  @IsOptional()
  @Expose()
  public first_name?: string;

  @IsString()
  @IsOptional()
  @Expose()
  public last_name?: string;

  @IsString()
  @IsOptional()
  @Expose()
  public email?: string;
}

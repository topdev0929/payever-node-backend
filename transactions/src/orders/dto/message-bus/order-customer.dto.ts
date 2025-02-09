import { IsDate, IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class OrderCustomerDto {
  @IsString()
  @Expose()
  public email: string;

  @IsString()
  @Expose()
  public phone: string;

  @IsDate()
  @Expose()
  public birthdate: Date;
}

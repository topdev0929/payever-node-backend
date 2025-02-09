import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class OrderCustomerResponseDto {
  @Expose()
  public email: string;

  @Expose()
  public phone?: string;

  @Expose()
  public birthdate?: Date;
}

import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class ApiCallPaymentCreateMessageDto {
  @IsString()
  @Expose()
  public subject?: string;

  @IsString()
  @Expose()
  public content?: string;
}

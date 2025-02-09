import { Exclude, Expose } from 'class-transformer';
import { ApiCallResultDto } from './api-call-result.dto';

@Exclude()
export class PaymentCreateResultDto extends ApiCallResultDto {
  @Expose()
  public readonly redirect_url?: string;

  @Expose()
  public readonly qr_code?: string;

  @Expose()
  public readonly iframe?: string;
}

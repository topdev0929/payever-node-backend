import { Exclude, Expose } from 'class-transformer';
import { ApiCallResultDto } from './api-call-result.dto';

@Exclude()
export class ApiCallSuccessDto extends ApiCallResultDto {
  @Expose()
  public readonly result: any;
}

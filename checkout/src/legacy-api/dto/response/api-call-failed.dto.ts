import { Exclude, Expose } from 'class-transformer';
import { ApiCallResultDto } from './api-call-result.dto';

@Exclude()
export class ApiCallFailedDto extends ApiCallResultDto {
  @Expose()
  public readonly error: string;

  @Expose()
  public readonly error_description: string;
}

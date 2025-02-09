import { Exclude, Expose } from 'class-transformer';
import { ApiCallResponseInterface } from '../../interfaces';

@Exclude()
export class ApiCallResultDto {
  @Expose()
  public readonly call: ApiCallResponseInterface;
}

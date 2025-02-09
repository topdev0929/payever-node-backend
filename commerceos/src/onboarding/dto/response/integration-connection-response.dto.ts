import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class IntegrationConnectionResponseDto  {
  @Expose()
  public _id: string;
}

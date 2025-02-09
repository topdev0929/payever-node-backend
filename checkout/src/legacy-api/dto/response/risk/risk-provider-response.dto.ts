import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RiskProviderResponseDto {
  @Expose()
  public name: string;

  @Expose()
  public script: string;
}

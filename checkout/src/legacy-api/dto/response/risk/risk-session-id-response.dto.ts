import { Exclude, Expose, Type } from 'class-transformer';
import { RiskProviderResponseDto } from './risk-provider-response.dto';

@Exclude()
export class RiskSessionIdResponseDto {
  @Expose({ name: 'orgId' })
  public risk_org_id: string;

  @Expose({ name: 'riskSessionId' })
  public risk_session_id: string;

  @Expose()
  @Type(() => RiskProviderResponseDto)
  public provider: RiskProviderResponseDto;
}

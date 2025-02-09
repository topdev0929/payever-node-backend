import { TrustedDomainDto } from '../dto';
import { TrustedDomainInterface } from '../interfaces';

export class TrustedDomainTransformer {
  public static interfaceToDto(domain: TrustedDomainInterface): TrustedDomainDto {
    return {
      businessId: domain.businessId,
      domain: domain.domain,
      id: domain.id,
    };
  }
}

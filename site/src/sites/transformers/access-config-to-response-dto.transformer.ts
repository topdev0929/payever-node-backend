import { AccessConfigResponseDto } from '../dto';
import { SiteAccessConfig, SiteAccessConfigDocument } from '../schemas';

export function accessConfigToResponseDto(accessConfig: SiteAccessConfigDocument): AccessConfigResponseDto {
  const plainAccessConfig: SiteAccessConfig = accessConfig?.toObject();

  return {
    ...plainAccessConfig,
    id: plainAccessConfig._id,
    privatePassword: undefined,
  };
}

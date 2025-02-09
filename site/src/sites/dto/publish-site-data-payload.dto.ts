import { AccessConfigResultDto } from './access-config-result.dto';

export interface PublishSiteDataPayloadDto {
  accessConfig: AccessConfigResultDto[];
  domainNames: string[];
}

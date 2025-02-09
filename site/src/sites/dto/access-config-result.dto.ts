import { AccessConfigResponseDto } from './access-config-response.dto';
import { Site } from '../schemas';

export interface AccessConfigResultDto extends Omit<Site, 'accessConfig'> {
  id?: string;
  accessConfig: AccessConfigResponseDto;
}

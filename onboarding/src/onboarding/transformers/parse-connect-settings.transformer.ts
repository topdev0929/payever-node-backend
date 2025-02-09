import { keyBy, Dictionary } from 'lodash';
import {
  plainToClass,
} from 'class-transformer';

import { ConnectSettingsCellDto } from '../dto';

export function parseConnectSettingsCellDto(value: string): ConnectSettingsCellDto {
  const plain: Dictionary<string> = keyBy(value?.split(';').filter(Boolean), (item: string) => {
    return (new URL(`creds://${item}`)).host;
  });

  return plainToClass(ConnectSettingsCellDto, plain);
}

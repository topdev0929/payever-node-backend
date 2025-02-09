import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { RpcGetApiKeysDto } from './rpc-get-api-keys.dto';

export class RpcCreateApiKeyDto extends RpcGetApiKeysDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public id: string;
}

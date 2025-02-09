import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RpcGetApiKeysDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public businessId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public channelType: string;
}

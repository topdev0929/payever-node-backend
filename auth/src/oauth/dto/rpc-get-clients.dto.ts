import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class RpcGetClientsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public businessId: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  public clientIds: string[];
}

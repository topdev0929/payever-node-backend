import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RpcRemoveBusinessDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public businessId: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateClientDto } from './create-client.dto';

export class RpcCreateClientDto extends CreateClientDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public businessId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public userId: string;
}

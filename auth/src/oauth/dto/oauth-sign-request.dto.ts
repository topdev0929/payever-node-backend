import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class OAuthSignRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public client_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public hash_alg: string;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  public messages: SignMessageInterface[];
}

export interface SignMessageInterface {
  id: string;
  value: string;
}

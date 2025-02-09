import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';


export class OAuthSignTokenRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public client_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public hash_alg: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public message: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public signature: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public grant_type: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public scope: string;
}

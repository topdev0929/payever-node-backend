import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TokenRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public clientId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public clientSecret: string;
}

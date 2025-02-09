import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTokenDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public password: string;
}

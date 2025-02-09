import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ApiKeyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public id: string;
}

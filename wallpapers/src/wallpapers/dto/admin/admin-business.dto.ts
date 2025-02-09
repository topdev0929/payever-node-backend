import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AdminBusinessDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public businessId: string;
}

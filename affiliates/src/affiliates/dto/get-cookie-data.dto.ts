import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetCookieDataDto {  
  @ApiProperty()
  @IsString()
  public hash: string; 
}

import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AffiliateProgramDto } from '.';

export class AdminAffiliateProgramDto extends AffiliateProgramDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public businessId: string;
}

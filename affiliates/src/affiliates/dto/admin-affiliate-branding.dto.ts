import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AffiliateBrandingDto } from './affiliate-branding.dto';

export class AdminAffiliateBrandingDto extends AffiliateBrandingDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public businessId: string;
}

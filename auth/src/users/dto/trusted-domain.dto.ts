import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TrustedDomainDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public domain: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public businessId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public id: string;
}

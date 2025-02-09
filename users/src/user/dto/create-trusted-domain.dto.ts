import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTrustedDomainDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public id?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public domain: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public businessId: string;
}

// tslint:disable: max-classes-per-file
import { IsNotEmpty, IsString, IsFQDN, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateDomainDto } from '.';

export class AdminCreateDomainDto extends CreateDomainDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public businessId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public siteId: string;
}

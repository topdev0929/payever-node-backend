import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateClientDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public organizationId?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public redirectUri: string;
}

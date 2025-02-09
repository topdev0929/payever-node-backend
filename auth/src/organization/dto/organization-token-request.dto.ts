import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsIn, IsArray } from 'class-validator';
import { ALL_APPS } from '../../users/constants';

export class OrganizationTokenRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public clientId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public clientSecret: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsIn(ALL_APPS.map((app: any) => app.code), { each: true })
  public scopes: string[] = ['connect'];
}

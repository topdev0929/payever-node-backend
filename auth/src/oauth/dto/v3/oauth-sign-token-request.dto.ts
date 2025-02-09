import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsString, IsOptional } from 'class-validator';

import { ScopesEnum } from '../../../common';

export class V3OAuthSignTokenRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public client_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public hash_alg: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public message: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public signature: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public grant_type: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public business_id?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsEnum(ScopesEnum, { each: true })
  public scopes: ScopesEnum[] = [];
}

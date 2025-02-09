import { Allow, IsNotEmpty, IsOptional, IsString, IsDefined } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ServerTypeEnum } from '../enum';

export class UserMailDto {
  @IsString()
  @IsDefined()
  public to: string;

  @IsOptional()
  @IsString()
  public locale?: string;

  @IsString()
  @IsOptional()
  public subject?: string;

  @IsString()
  @IsNotEmpty()
  public templateName: string;

  @Allow()
  @Expose()
  public variables: any;

  @ApiProperty()
  @IsOptional()
  public serverType?: ServerTypeEnum;
}

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { AccessInfo } from './access-info';

export class AccessDto {
  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type((): any => AccessInfo)
  public business?: AccessInfo;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type((): any => AccessInfo)
  public user?: AccessInfo;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type((): any => AccessInfo)
  public admin?: AccessInfo;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type((): any => AccessInfo)
  public partner?: AccessInfo;
}

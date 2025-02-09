import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { AccessInfoInterface } from '../interfaces/app.model';

export class AccessDto {
  @ApiProperty()
  @IsOptional()
  public business?: AccessInfoInterface;

  @ApiProperty()
  @IsOptional()
  public user?: AccessInfoInterface;

  @ApiProperty()
  @IsOptional()
  public admin?: AccessInfoInterface;

  @ApiProperty()
  @IsOptional()
  public partner?: AccessInfoInterface;
}

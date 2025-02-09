import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsOptional, IsString } from 'class-validator';

import { PatchGroupInterface } from '../../interfaces';
import { AclDto } from '../acl.dto';

export class PatchGroupDto implements PatchGroupInterface {
  @ApiProperty()
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiProperty()
  @Allow()
  public acls?: AclDto[];
}

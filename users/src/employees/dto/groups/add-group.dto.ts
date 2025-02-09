import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { AddGroupInterface } from '../../interfaces';
import { AclDto } from '../acl.dto';

export class AddGroupDto implements AddGroupInterface {
  @ApiProperty()
  @IsOptional()
  @IsString()
  public _id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public name: string;

  @ApiProperty()
  @Allow()
  public acls?: AclDto[];
}

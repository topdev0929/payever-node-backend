import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsNotEmpty, IsString } from 'class-validator';

import { AddGroupInterface } from '../../interfaces';
import { AclDto } from '../../../users/dto';

export class AddGroupDto implements AddGroupInterface {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public name: string;

  @ApiProperty()
  @Allow()
  public acls?: AclDto[];
}

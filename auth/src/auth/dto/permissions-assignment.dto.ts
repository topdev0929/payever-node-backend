import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';
import { AclInterface } from '@pe/nest-kit';

export class PermissionsAssignmentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  public acls: AclInterface[];
}

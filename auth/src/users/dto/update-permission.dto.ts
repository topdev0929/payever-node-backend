import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { AclDto } from '../dto';

export class UpdatePermissionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID('4')
  public businessId: string;

  @ApiProperty()
  @IsNotEmpty()
  public acls: AclDto[];
}

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';
import { UpdatePermissionDto } from './update-permission.dto';

export class UpdatePermissionsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  public permissions: UpdatePermissionDto[];
}

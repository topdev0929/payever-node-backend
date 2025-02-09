import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AssignPermissionsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID('4')
  public businessId: string;
}

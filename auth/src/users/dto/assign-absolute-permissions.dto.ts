import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AssignAbsolutePermissionsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID('4')
  public businessId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public userId: string;
}

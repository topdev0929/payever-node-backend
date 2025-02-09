import { ApiProperty } from '@nestjs/swagger';
import { UserRoleInterface } from '@pe/nest-kit';
import { IsBoolean, IsOptional } from 'class-validator';

export class EditDto {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  public secondFactorRequired: boolean;

  @ApiProperty()
  @IsOptional()
  public roles: UserRoleInterface;
}

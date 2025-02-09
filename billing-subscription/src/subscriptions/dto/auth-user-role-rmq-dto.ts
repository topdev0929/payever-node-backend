import { RolesEnum } from '@pe/nest-kit';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserRoleRmqDto {
  @IsString()
  @IsNotEmpty()
  public name: RolesEnum;
}

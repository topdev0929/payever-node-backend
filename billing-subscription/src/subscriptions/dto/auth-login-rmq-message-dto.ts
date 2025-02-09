import { IsNotEmpty, IsString, ValidateNested, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRoleRmqDto } from './auth-user-role-rmq-dto';

export class AuthLoginRmqMessageDto {
  @IsString()
  @IsNotEmpty()
  public id: string;
  @ValidateNested()
  @Type(() => UserRoleRmqDto)
  public roles: UserRoleRmqDto[];
}

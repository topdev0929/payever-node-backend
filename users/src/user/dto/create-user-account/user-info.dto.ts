import { IsBoolean, IsString, IsOptional } from 'class-validator';
import { UserRegistrationOriginDto } from './user-registration-origin-dto';

export class UserInfoDto {
  @IsBoolean()
  @IsOptional()
  public hasUnfinishedBusinessRegistration: boolean;

  @IsOptional()
  public registrationOrigin: UserRegistrationOriginDto;

  @IsOptional()
  @IsString()
  public language?: string;
}

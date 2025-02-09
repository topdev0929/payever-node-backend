import { IsString, IsNotEmpty } from 'class-validator';

export class BusinessPermissionDto{
  @IsString()
  @IsNotEmpty()
  public businessId: string;

  @IsString()
  @IsNotEmpty()
  public userId: string;
}

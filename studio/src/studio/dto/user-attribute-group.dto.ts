import { IsNotEmpty, IsString } from 'class-validator';

export class UserAttributeGroupDto  {
  @IsString()
  @IsNotEmpty()
  public businessId: string;

  @IsString()
  @IsNotEmpty()
  public name: string;
}

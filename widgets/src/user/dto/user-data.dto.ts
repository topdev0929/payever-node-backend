import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserDataDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public _id: string;

  @IsNotEmpty()
  public userAccount: UserAccountInterface;
}

export interface UserAccountInterface {
  _id: string;
  currency: string;
  createdAt: string;
}

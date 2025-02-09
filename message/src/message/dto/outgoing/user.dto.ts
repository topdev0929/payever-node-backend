/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';

import { UserInterface } from '../../../projections/schema';

type UserAccountInterface = UserInterface['userAccount'];

class UserAccountHttpResponseDto implements UserAccountInterface {
  @ApiProperty()
  public email: string;

  @ApiProperty()
  public firstName: string;

  @ApiProperty()
  public lastName: string;

  @ApiProperty()
  public logo: string;

  @ApiProperty()
  public phone: string;
}

export class UserHttpResponseDto implements Pick<
  UserInterface,
  'userAccount'
> {
  @ApiProperty()
  public _id: string;

  @ApiProperty()
  public userAccount: UserAccountHttpResponseDto;
}

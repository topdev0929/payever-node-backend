import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { BaseBusinessDto } from './create-business/business.dto';
import { UserAccountDto } from './update-user-account/user-account.dto';

export class RpcCreateBusinessDto {
  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => BaseBusinessDto)
  public business: BaseBusinessDto;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UserAccountDto)
  public user: UserAccountDto;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public userId: string;
}

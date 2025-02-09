import { ApiProperty } from '@nestjs/swagger';

import { Permissions } from '../../submodules/platform';

export class PermissionsHttpResponseDto implements Permissions {
  @ApiProperty()
  public change: boolean;

  @ApiProperty()
  public showSender: boolean;

  @ApiProperty()
  public addMembers: boolean;

  @ApiProperty()
  public pinMessages: boolean;

  @ApiProperty()
  public sendMedia: boolean;

  @ApiProperty()
  public sendMessages: boolean;

  @ApiProperty()
  public readonly publicView: boolean;

  @ApiProperty()
  public readonly live: boolean;
}

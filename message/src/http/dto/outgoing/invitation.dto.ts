/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';

class InvitationMessagingDto {
  @ApiProperty()
  public _id: string;

  @ApiProperty()
  public type: string;

  @ApiProperty()
  public title: string;

  @ApiProperty()
  public photo?: string;
}

export class InvitationHttpResponseDto {
  @ApiProperty()
  public code: string;

  @ApiProperty({
    type: InvitationMessagingDto,
  })
  public messaging: InvitationMessagingDto;
}

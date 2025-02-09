/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';

import { MessagingHttpResponseDto } from '../../../message/dto';
import { ChatDraftMessageDocument } from '../../../message/submodules/draft-messages';

export class LocationResponseDto {
  @ApiProperty()
  public _id: string;

  @ApiProperty()
  public folderId?: string;
}

export class MessagingInFolderHttpResponseDto extends MessagingHttpResponseDto {
  @ApiProperty()
  public locations: LocationResponseDto[];

  @ApiProperty()
  public draft: ChatDraftMessageDocument;
}

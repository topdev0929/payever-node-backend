import { IsOptional, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { PrivacyStatusDto } from './privacy-status.dto';
import { PrivacyForwardedMessagesDto } from './privacy-forward-message.dto';
import { PrivacyProfilePhotoDto } from './privacy-profile-photo.dto';
import { PrivacyChannelsAndGroupsDto } from './privacy-channels-and-groups.dto';

export class PrivacyDto {
  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => PrivacyStatusDto)
  public status: PrivacyStatusDto;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => PrivacyForwardedMessagesDto)
  public forwardedMessage: PrivacyForwardedMessagesDto;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => PrivacyProfilePhotoDto)
  public profilePhoto: PrivacyProfilePhotoDto;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => PrivacyChannelsAndGroupsDto)
  public channelsAndGroups: PrivacyChannelsAndGroupsDto;
}

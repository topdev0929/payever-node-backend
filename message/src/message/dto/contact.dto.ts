/* eslint-disable max-classes-per-file */
import { IsString, IsUUID, IsDate, IsOptional, IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import {
  ContactInterface,
  MessagingIntegrationsEnum,
  ChatMemberStatusEnum,
} from '@pe/message-kit';

export class ContactCommunicationDto {
  @ApiProperty()
  @IsString()
  public identifier: string;

  @ApiProperty({
    enum: MessagingIntegrationsEnum,
  })
  @IsEnum(MessagingIntegrationsEnum)
  public integrationName: MessagingIntegrationsEnum;
}

export class ContactDto implements ContactInterface {
  @ApiProperty()
  @IsUUID(4)
  @IsNotEmpty()
  public _id: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public avatar?: string;

  @ApiProperty()
  @IsUUID(4)
  @IsNotEmpty()
  public business: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  public lastSeen?: Date;

  @ApiProperty()
  @Type(() => ContactCommunicationDto)
  @ValidateNested({
    each: true,
  })
  public communications: ContactCommunicationDto[];

  @ApiProperty()
  @IsEnum(ChatMemberStatusEnum)
  @IsOptional()
  public status?: ChatMemberStatusEnum;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public name: string;
}

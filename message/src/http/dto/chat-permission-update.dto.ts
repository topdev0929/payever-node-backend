import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Permissions } from '../../message/submodules/platform';

export class ChatPermissionUpdateHttpRequestDto implements Partial<Permissions> {
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  public publicView?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  public change?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  public showSender?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  public live?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  public sendMessages?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  public sendMedia?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  public addMembers?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  public pinMessages?: boolean;
}

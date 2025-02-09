import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { MemberPermissions } from '../../message/submodules/platform';

export class MemberPermissionUpdateHttpRequestDto implements Partial<MemberPermissions> {
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  public sendMessages?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  public sendMedia?: boolean;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { Status } from '../enum';

export class OwnerInviteDto {
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  public dryRun: boolean = false;

  @ApiProperty()
  @IsNotEmpty()
  public status: Status[] = [Status.invited];
}

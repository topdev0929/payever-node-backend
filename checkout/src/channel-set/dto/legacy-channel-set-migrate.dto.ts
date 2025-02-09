import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LegacyChannelSetMigrateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public uuid: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public original_id: string;
}

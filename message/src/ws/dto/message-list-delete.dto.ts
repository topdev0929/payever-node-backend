import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class MessageListDeleteWsRequestDto {
  @ApiProperty()
  @IsUUID(4, { each: true })
  @IsNotEmpty()
  public _ids: string[];

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  public deleteForEveryone: boolean;
}

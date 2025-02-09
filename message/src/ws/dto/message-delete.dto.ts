import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class MessageDeleteWsRequestDto {
  @ApiProperty()
  @IsUUID(4)
  @IsNotEmpty()
  public _id: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  public deleteForEveryone: boolean;
}

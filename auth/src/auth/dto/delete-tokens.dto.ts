import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteTokensDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString({ each: true})
  public tokens: string[] = [];
}

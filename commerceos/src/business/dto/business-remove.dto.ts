import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BusinessRemoveDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public _id: string;
}

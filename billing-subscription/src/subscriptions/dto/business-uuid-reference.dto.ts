import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BusinessUuidReferenceDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  public uuid: string;
}

import { IsBoolean, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductMessagePayloadDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  public _id: string;

  @ApiProperty()
  @IsBoolean()
  public active: boolean;
}

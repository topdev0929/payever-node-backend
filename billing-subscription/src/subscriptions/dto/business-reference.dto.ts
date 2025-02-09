import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BusinessReferenceDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  public id: string;
}

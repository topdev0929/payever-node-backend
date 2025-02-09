import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConnectionHttpResponseDto {
  @IsString()
  @IsNotEmpty()
  public _id: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  public integrationName: string;
}

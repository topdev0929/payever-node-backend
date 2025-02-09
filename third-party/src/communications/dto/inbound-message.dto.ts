import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class InboundMessageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public to: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public from: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public message: string;
}

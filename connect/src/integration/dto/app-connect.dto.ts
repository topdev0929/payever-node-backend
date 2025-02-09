import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AppConnectDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public action: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public form: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public url: string;
}

import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IntegrationDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  public category: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  public name: string;
}

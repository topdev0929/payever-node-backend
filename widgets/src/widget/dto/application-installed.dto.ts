import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ApplicationInstalledDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public businessId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public code: string;
}

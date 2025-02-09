import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PackageTypeDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public displayName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public code: string;
}

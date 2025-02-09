import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class AccessInfo {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  public defaultInstalled?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  public isDefault?: boolean;

  @ApiProperty()
  @IsString()
  public url: string;
}

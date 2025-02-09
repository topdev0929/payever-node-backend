import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateAccessConfigDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  public isLive?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public internalDomain?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public internalDomainPattern?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  public isLocked?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  public version?: string;
}

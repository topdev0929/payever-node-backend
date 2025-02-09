import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateAccessConfigDto {
  @ApiProperty({ required: false})
  @IsOptional()
  @IsBoolean()
  public isLive?: boolean;

  @ApiProperty({ required: false})
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public internalDomain?: string;

  @ApiProperty({ required: false})
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public internalDomainPattern?: string;

  @ApiProperty({ required: false})
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public ownDomain?: string;

  @ApiProperty({ required: false})
  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  public isLocked?: boolean;

  @IsOptional()
  @IsBoolean()
  public isPrivate?: boolean;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public privateMessage?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public privatePassword?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public socialImage?: string;
  
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public version?: string;
}

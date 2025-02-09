import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAccessConfigDto {
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false })
  public isLive?: boolean;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ required: false })
  public internalDomain?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ required: false })
  public ownDomain?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false })
  public isPrivate?: boolean;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ required: false })
  public privateMessage?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ required: false })
  public privatePassword?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false })
  public approvedCustomersAllowed?: boolean;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ required: false })
  public socialImage?: string;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ required: false })
  public isLocked?: boolean;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public version?: string;
}

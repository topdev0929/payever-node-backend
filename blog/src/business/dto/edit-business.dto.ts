import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class EditBusinessDto {
  @IsOptional()
  @IsString()
  public _id?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public primaryColor?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public secondaryColor?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public primaryTransparency?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public secondaryTransparency?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray } from 'class-validator';

export class UpdateOrganizationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  public businesses?: string[];
}

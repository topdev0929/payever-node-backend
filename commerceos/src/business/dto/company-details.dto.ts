import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CompanyDetailsDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  public product?: string;
}

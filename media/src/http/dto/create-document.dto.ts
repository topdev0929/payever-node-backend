import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateDocumentDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  public id?: string;

  @ApiProperty()
  @IsOptional()
  public data: any;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  public expiresAt?: string;
}

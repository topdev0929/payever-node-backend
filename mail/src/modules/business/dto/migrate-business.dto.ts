import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class MigrateBusinessDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public _id: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  public legacyId: number;

  @ApiProperty()
  @IsOptional()
  public createdAt: string;
}

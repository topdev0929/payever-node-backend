import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MigrateBusinessDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public _id: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public currency: string;

  @ApiProperty()
  @IsOptional()
  public createdAt: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CopyCollectionDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  public collectionIds: string[];

  @IsOptional()
  public parent?: string;

  @IsOptional()
  public prefix?: string;
}

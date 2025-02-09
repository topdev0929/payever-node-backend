import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional, IsString, Max, Min, IsNotEmpty } from 'class-validator';
import {  Type } from 'class-transformer';

export class ListQueryDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  public orderBy: string = 'created_at';

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  public direction: string = 'asc';

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  public page: number = 1;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Max(100)
  public limit: number = 10;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public query?: string;

  @ApiProperty()
  @IsNotEmpty()
  public filters?: any = { };

  public get search(): string {
    return this.query;
  }

  public set search(search: string) {
    this.query = search;
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional, IsString, Max, Min, IsNotEmpty } from 'class-validator';
import {  Type } from 'class-transformer';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ListQueryDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  public orderBy: string = 'created_at';

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  @Field(() => String, { nullable: true })
  public direction: string = 'asc';

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Field(() => Number, { nullable: true })
  public page: number = 1;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Max(100)
  @Field(() => Number, { nullable: true })
  public limit: number = 10;

  @ApiProperty()
  @IsOptional()
  @Type(() => String)
  @Field(() => String, { nullable: true })
  public filters?: string;
}

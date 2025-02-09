import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BlogInterface, BlogPageInterface } from '../interfaces';

export class BlogPageDto implements BlogPageInterface {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public author: string; 

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public body: string;
  
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public blog: string;
  
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public caption: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public date: Date;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public description: string; 

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public image: string;
  
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public pageId: string;
  
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public subtitle: string;
  
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public title: string;
}

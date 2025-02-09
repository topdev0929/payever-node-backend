import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform  } from 'class-transformer';
import { IsString, IsOptional, Min } from 'class-validator';
export class BusinessListDto {

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  public page: number = 1;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  public limit: number = 20;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Transform((email: string) => email?.toLowerCase())
  public email: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  public admin: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  public userIds: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  public userEntities: any[];

  @ApiProperty({ required: false })
  @IsOptional()
  public query: any;

  @ApiProperty({ required: false })
  @IsOptional()
  public projection: any;

  @ApiProperty({ required: false })
  @IsOptional()
  public active: string;
}

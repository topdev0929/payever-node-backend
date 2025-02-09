import { ApiProperty } from '@nestjs/swagger';
import { Type  } from 'class-transformer';
import { IsOptional, IsString, Min } from 'class-validator';
import { AdminBaseQueryDto } from '.';


export class AdminUserMediaQueryDto extends AdminBaseQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  public albumIds?: string[];

  @ApiProperty({ required: false })
  @IsOptional()  
  public name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  public noalbum?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  public userAttributeId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  public userAttributeValue?: string;
}

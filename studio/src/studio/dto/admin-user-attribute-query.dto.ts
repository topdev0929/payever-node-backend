import { ApiProperty } from '@nestjs/swagger';
import { Type  } from 'class-transformer';
import { IsOptional, IsString, Min } from 'class-validator';
import { AdminBaseQueryDto } from '.';


export class AdminUserAttributeQueryDto extends AdminBaseQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  public type?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetCategoriesListDto {
  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsString()
  public businessId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public name?: string;
}

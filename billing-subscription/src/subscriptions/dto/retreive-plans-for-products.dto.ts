import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RetreivePlansForProductsDto {
  @ApiProperty({ required: true })
  @IsString({ each: true})
  @IsNotEmpty({ each: true})
  public ids: string[];
}

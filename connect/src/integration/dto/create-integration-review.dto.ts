import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateIntegrationReviewDto {

  @ApiProperty()
  @IsNotEmpty()
  public title: string;

  @ApiProperty()
  @IsNotEmpty()
  public text: string;

  @ApiProperty()
  @IsNotEmpty()
  public rating: number;
}

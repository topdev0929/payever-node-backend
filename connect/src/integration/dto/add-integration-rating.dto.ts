import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AddIntegrationRatingDto {

  @ApiProperty({
    maximum: 5,
    minimum: 0,
  })
  @IsNotEmpty()
  public rating: number;
}

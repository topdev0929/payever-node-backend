import { IsDefined, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductReferenceDto } from './product-reference.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionDto {
  @ApiProperty({ required: true })
  @ValidateNested()
  @IsDefined()
  @Type(() => ProductReferenceDto)
  public product: ProductReferenceDto;
}

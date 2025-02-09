import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderCartItemAttributesDimensionsDto } from './create-order-cart-item-attributes-dimensions.dto';

export class CreateOrderCartItemAttributesDto {
  @ApiProperty()
  @IsNumber({ }, { groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  public weight?: number;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit']})
  @Type(() => CreateOrderCartItemAttributesDimensionsDto)
  @ValidateNested({ groups: ['create', 'submit']})
  public dimensions?: CreateOrderCartItemAttributesDimensionsDto;
}

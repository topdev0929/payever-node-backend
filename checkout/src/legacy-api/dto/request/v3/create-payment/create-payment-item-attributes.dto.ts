import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePaymentItemAttributesDimensionsDto } from './create-payment-item-attributes-dimensions.dto';

export class CreatePaymentItemAttributesDto {
  @ApiProperty()
  @IsNumber({ }, { groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  public weight?: number;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit']})
  @Type(() => CreatePaymentItemAttributesDimensionsDto)
  @ValidateNested({ groups: ['create', 'submit']})
  public dimensions?: CreatePaymentItemAttributesDimensionsDto;
}

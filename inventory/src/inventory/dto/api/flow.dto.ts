import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { CartItemDto } from './cart-item.dto';

export class FlowDto {
  @IsString()
  @IsOptional()
  public id: string;

  @Type(() => CartItemDto)
  @ValidateNested({ each: true })
  @IsOptional()
  public cart: CartItemDto[];
}

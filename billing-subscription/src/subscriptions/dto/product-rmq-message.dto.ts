import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ProductBaseDto } from './product.dto';

export class ProductRmqMessageDto extends ProductBaseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  public businessId: string;
}

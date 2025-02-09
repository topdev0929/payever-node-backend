import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';


export class PaymentMethodDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsObject()
  public credentials: any;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public type: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateInvoiceDto {
  @ApiProperty()
  @IsString()
  public businessId: string; // customerId

  @ApiProperty()
  @IsNumber()
  public quantity: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  public unitGrossPrice?: number; //  either unitGrossPrice or unitNetPrice must be specified

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  public unitNetPrice?: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  public taxEnabled: boolean;

  @ApiProperty()
  @IsNumber()
  public taxRate: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ConnectionDtoBase } from './connection.dto';
import { BusinessHttpRequestDto } from './business-http-request.dto';
import { PaymentMethodsEnum } from '../enums';

export class ConnectionHttpRequestDto extends ConnectionDtoBase {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public _id: string;

  @ApiProperty()
  @IsDefined()
  @ValidateNested()
  @Type(() => BusinessHttpRequestDto)
  public business: BusinessHttpRequestDto;


  @ApiProperty()
  @IsOptional()
  @IsEnum(PaymentMethodsEnum)
  public integrationName: PaymentMethodsEnum;
}

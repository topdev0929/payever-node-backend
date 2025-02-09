import { IsString, IsNotEmpty, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionItemRmqMessageDto } from './transaction-item.dto';
import { BusinessUuidReferenceDto } from './business-uuid-reference.dto';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionRmqMessageDto {
  @IsString()
  @IsNotEmpty()
  public uuid: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public user_uuid: string;

  @ApiProperty({ required: true })
  @ValidateNested()
  @Type(() => BusinessUuidReferenceDto)
  public business: BusinessUuidReferenceDto;

  @ApiProperty({ required: true })
  @ValidateNested()
  @Type(() => TransactionItemRmqMessageDto)
  public items: TransactionItemRmqMessageDto[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public customer_email: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public customer_name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public reference: string;
}

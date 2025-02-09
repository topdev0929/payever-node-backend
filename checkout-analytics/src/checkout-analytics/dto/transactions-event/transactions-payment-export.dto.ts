import { 
  IsDateString, 
  IsNumber, 
  IsOptional, 
  IsString, 
  ValidateNested, 
  IsArray,
} from 'class-validator';
import { IdDto } from './id.dto';
import { TransactionsCustomerDto } from './transactions-customer.dto';


export class TransactionsPaymentExportDto {
  @IsOptional()
  @IsString()
  public id: string;

  @IsOptional()
  @IsNumber()
  public amount: number;

  @IsOptional()
  @ValidateNested()
  public business: IdDto;

  @IsOptional()
  @IsString()
  public channel: string;

  @IsOptional()
  @ValidateNested()
  public channel_set: IdDto;

  @IsOptional()
  @ValidateNested()
  public customer: TransactionsCustomerDto;

  @IsOptional()
  @IsDateString()
  public date: Date;

  @IsOptional()
  @IsArray()
  public items: any[];

  @IsOptional()
  @IsString()
  public reference: string;

  @IsOptional()
  @ValidateNested()
  public user: IdDto;

}

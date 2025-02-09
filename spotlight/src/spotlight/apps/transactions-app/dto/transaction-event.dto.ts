import { IsNotEmpty, IsString, ValidateNested, IsNumber } from 'class-validator';

export class TransactionEventDto {
  @IsString()
  @IsNotEmpty()
  public id: string;

  @ValidateNested()
  public business: BusinessInerface;

  @IsString()
  @IsNotEmpty()
  public reference : string;

  @IsString()
  @IsNotEmpty()
  public channel: string;

  public customer: {
    email: string;
    name: string;
  };

  @IsNumber()
  @IsNotEmpty()
  public amount: number;
}

interface BusinessInerface {
  id: string;
}


import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { PaymentEventBusinessDto } from './payment-event-business.dto';
import { PaymentStatusesEnum } from '../enums';

export class PaymentEventDto {
  @IsNotEmpty()
  @IsString()
  public id: string;

  @IsNotEmpty()
  @IsString()
  public uuid: string;

  @IsNotEmpty()
  @ValidateNested()
  public business: PaymentEventBusinessDto;

  @IsNotEmpty()
  @IsString()
  public payment_type: string;

  @IsNotEmpty()
  @IsString()
  public status: PaymentStatusesEnum;

  @IsNotEmpty()
  @Transform((value: string) => { if (value) { return new Date(value); } }, { toClassOnly: true })
  public created_at: Date;

  @IsNotEmpty()
  @Transform((value: string) => { if (value) { return new Date(value); } }, { toClassOnly: true })
  public updated_at: Date;
}

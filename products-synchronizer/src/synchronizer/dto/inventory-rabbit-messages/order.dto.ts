import { ReservationDto } from './reservation.dto';
import { IsString, IsArray } from 'class-validator';

export class OrderDto {
  @IsString()
  public flow: string;

  @IsString()
  public transaction: string;

  @IsArray()
  public reservations: ReservationDto[];

  @IsString()
  public status: string;
}

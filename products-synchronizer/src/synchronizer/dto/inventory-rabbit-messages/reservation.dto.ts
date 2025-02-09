import { Type } from 'class-transformer';
import { IsString, IsNumber, ValidateNested, IsDefined } from 'class-validator';
import { InventoryDto } from './inventory.dto';

export class ReservationDto {
  @ValidateNested()
  @IsDefined()
  @Type(() => InventoryDto)
  public inventory: InventoryDto;

  @IsNumber()
  public quantity: number;
}

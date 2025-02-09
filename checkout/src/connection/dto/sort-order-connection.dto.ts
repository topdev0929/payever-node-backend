import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class SortOrderConnectionDto {
  @IsNotEmpty()
  @IsString()
  public connectionId: string;

  @IsNotEmpty()
  @IsNumber()
  public sortOrder: number;
}

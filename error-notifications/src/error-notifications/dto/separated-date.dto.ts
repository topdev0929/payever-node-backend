import { IsInt, Max, Min } from 'class-validator';

export class SeparatedDateDto {
  @IsInt()
  @Min(1970)
  @Max(2050)
  public year: number;

  @IsInt()
  @Min(0)
  @Max(11)
  public month: number;

  @IsInt()
  @Min(0)
  @Max(11)
  public date: number;

  @IsInt()
  @Min(0)
  @Max(23)
  public hour: number;

  @IsInt()
  @Min(0)
  @Max(59)
  public minutes: number;

  @IsInt()
  @Min(0)
  @Max(59)
  public seconds: number;

  @IsInt()
  @Min(0)
  @Max(6)
  public dayOfWeek: number;
}

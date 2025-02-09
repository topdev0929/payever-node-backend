import { Exclude, Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

@Exclude()
export class OrderCartItemAttributesDimensionsDto {
  @IsNumber()
  @Expose()
  public height?: number;

  @IsNumber()
  @Expose()
  public width?: number;

  @IsNumber()
  @Expose()
  public length?: number;
}

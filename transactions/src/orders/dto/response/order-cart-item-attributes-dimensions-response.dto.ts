import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class OrderCartItemAttributesDimensionsResponseDto {
  @Expose()
  public height?: number;

  @Expose()
  public width?: number;

  @Expose()
  public length?: number;
}

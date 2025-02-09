import { IsNotEmpty, IsString } from 'class-validator';

export class VariantAttributeDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public type: string;
}

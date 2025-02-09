import { IsNotEmpty, IsNumber } from 'class-validator';

export class ResolutionDto {
  @IsNumber()
  @IsNotEmpty()
  public width: number;

  @IsNumber()
  @IsNotEmpty()
  public height: number;
}

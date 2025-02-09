import { IsNotEmpty, IsString } from 'class-validator';

export class PredictCategoryInputDto {
  @IsString()
  @IsNotEmpty()
  public title: string;
}

import { IsNotEmpty, IsString } from 'class-validator';

export class ProductIdListDto {
  @IsString({ each: true})
  @IsNotEmpty({ each: true})
  public ids: string[];
}

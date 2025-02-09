import { IsString } from 'class-validator';

export class RemoveProductDto {
  @IsString({ each: true })
  public readonly productIds: string[];
}

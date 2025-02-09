import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteCollectionsListDto {
  @IsString({ each: true})
  @IsNotEmpty({ each: true})
  public ids: string[];
}

import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveApplicationDto {
  @IsString()
  @IsNotEmpty()
  public id: string;
}

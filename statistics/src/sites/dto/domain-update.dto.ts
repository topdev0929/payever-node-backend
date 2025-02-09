import { IsNotEmpty, IsString } from 'class-validator';

export class DomainUpdateDto {
  @IsString()
  @IsNotEmpty()
  public id: string;

  @IsString()
  @IsNotEmpty()
  public newDomain: string;
}

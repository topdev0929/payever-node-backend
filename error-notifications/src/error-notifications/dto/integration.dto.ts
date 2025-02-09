import { IsNotEmpty, IsString } from 'class-validator';

export class IntegrationDto {
  @IsNotEmpty()
  @IsString()
  public name: string;
}

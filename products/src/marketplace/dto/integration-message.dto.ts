import { IsNotEmpty, IsString } from 'class-validator';

export class IntegrationMessageDto {
  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsNotEmpty()
  @IsString()
  public category: string;
}

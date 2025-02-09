import { IsString, IsNotEmpty } from 'class-validator';

export class ContactFieldDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public value: string;
}

import { IsString, IsNotEmpty } from 'class-validator';

export class ThirdPartyNameReferenceDto {
  @IsString()
  @IsNotEmpty()
  public name: string;
}

import { IsNotEmpty, IsString } from 'class-validator';

export class ClientThemePublishedDto {
  @IsString()
  @IsNotEmpty()
  public builderThemeId: string;
}

import { IsString, IsNotEmpty } from 'class-validator';

export class ChatUpdateHttpRequestDto {
  @IsString()
  @IsNotEmpty()
  public title: string;
}

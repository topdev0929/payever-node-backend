import { IsNotEmpty, IsOptional } from 'class-validator';

export class UnreadMessagesCountRequestDto {
  @IsNotEmpty()
  public chatId: string;

  @IsOptional()
  public from: Date;
}

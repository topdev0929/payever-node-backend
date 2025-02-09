import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class ChatEventDto {
  @IsString()
  @IsNotEmpty()
  public id: string;

  @IsOptional()
  public businessId: string;

  public lastMessage: {
    content: string;
  };

  @IsOptional()
  public salt: string;

  @IsOptional()
  public lastSeen?: Date;

  @IsString()
  @IsOptional()
  public photo?: string;

  @IsString()
  @IsOptional()
  public name: string;
}

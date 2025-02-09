import { IsNotEmpty, IsString } from 'class-validator';

export class BusinessMessageDto {
  @IsNotEmpty()
  @IsString()
  public id: string;
}

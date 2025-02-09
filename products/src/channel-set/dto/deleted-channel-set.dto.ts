import { IsNotEmpty, IsString } from 'class-validator';

export class DeletedChannelSetDto {
  @IsNotEmpty()
  @IsString()
  public _id: string;
}

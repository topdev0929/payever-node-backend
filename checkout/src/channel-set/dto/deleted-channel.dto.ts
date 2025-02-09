import { IsNotEmpty, IsString } from 'class-validator';

export class DeletedChannelDto {
  @IsNotEmpty()
  @IsString()
  public _id: string;
}

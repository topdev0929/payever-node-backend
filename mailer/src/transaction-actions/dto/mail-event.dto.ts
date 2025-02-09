import { IsNotEmpty, IsString } from 'class-validator';

export class MailEventDto {
  @IsString()
  @IsNotEmpty()
  public event_id: string;
  @IsString()
  @IsNotEmpty()
  public template_name: string;
}

import { MailEventDto } from './mail-event.dto';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class HistoryItemDto {
  @IsString()
  @IsNotEmpty()
  public action: string;
  @ValidateNested()
  @Type(() => MailEventDto)
  public mail_event: MailEventDto;
}

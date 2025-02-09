import { IsString } from 'class-validator';

export class MailerReportEventDto {
  @IsString({ each: true })
  public businessIds: string[];
}

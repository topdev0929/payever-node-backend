import { Exclude, Expose } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';

@Exclude()
export class ErrorNotificationEmailVariablesDto {
  @IsString()
  @Expose()
  public integration?: string;

  @IsArray()
  @Expose()
  public errors: any[] = [];
}

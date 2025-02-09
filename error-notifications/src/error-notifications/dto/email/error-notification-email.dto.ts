import { Exclude, Expose } from 'class-transformer';
import { IsString, IsOptional } from 'class-validator';

@Exclude()
export class ErrorNotificationEmailDto {
  @IsString()
  @IsOptional()
  public to?: string;

  @IsString()
  @IsOptional()
  public bcc?: string[];

  @IsString()
  @Expose()
  public businessId: string;

  @IsString()
  @Expose()
  public locale: string = 'en';

  @IsString()
  @Expose()
  public templateName: string;

  @Expose()
  public variables: any;
}

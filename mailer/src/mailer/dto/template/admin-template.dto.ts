import { IsString, IsArray, IsOptional, IsBoolean } from 'class-validator';

export class AdminTemplateDto {
  @IsArray()
  @IsOptional()
  public attachments: [];

  @IsString()
  @IsOptional()
  public body: string;

  @IsString()
  @IsOptional()
  public description: string;

  @IsString()
  @IsOptional()
  public layout: string;

  @IsString()
  @IsOptional()
  public locale: string;

  @IsString()
  @IsOptional()
  public section: string;

  @IsString()
  @IsOptional()
  public subject: string;

  @IsString()
  @IsOptional()
  public template_name: string;

  @IsString()
  @IsOptional()
  public template_type: string;

  @IsBoolean()
  @IsOptional()
  public use_layout: boolean;
}
